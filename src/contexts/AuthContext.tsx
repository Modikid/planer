import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Store JWT token in localStorage when user is authenticated
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('firebase_token', token);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        localStorage.removeItem('firebase_token');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem('firebase_token', token);
    return result;
  };

  const register = async (email: string, password: string): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem('firebase_token', token);
    return result;
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('firebase_token');
    await signOut(auth);
  };

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      try {
        const token = await user.getIdToken(true); // Force refresh
        localStorage.setItem('firebase_token', token);
        return token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
    }
    return null;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
