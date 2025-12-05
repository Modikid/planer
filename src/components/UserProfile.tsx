import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';

interface UserApiResponse {
  success: boolean;
  user: {
    uid: string;
    email: string;
    email_verified: boolean;
  };
}

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const { data, loading, error } = useApi<UserApiResponse>('/api/user');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Error: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <PersonIcon fontSize="large" color="primary" />
          <Typography variant="h5" component="div">
            User Profile
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Email: {user?.email}
        </Typography>
        
        {data && (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              User ID: {data.user.uid}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email Verified: {data.user.email_verified ? 'Yes' : 'No'}
            </Typography>
          </>
        )}
        
        <Box mt={2}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
