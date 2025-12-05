import { useState, useEffect, useMemo } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Modal,
  Box,
  Avatar,
  Badge,
  Container,
  Grid,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import './App.css'
import { useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { UserProfile } from './components/UserProfile'

type ThemeMode = 'light' | 'dark' | 'system'

function App() {
  const { user, loading, logout } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [bottomNavValue, setBottomNavValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const userMenuOpen = Boolean(anchorEl)
  
  // Тема: по умолчанию system, сохраняется в localStorage
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode')
    return (savedTheme as ThemeMode) || 'system'
  })

  // Определяем системную тему
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // Следим за изменениями системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Сохраняем выбор темы
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode)
  }, [themeMode])

  // Определяем активную тему
  const activeTheme = useMemo(() => {
    const mode = themeMode === 'system' ? systemTheme : themeMode
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#90caf9' : '#1976d2',
        },
        secondary: {
          main: mode === 'dark' ? '#f48fb1' : '#dc004e',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f5f5f5',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
      },
    })
  }, [themeMode, systemTheme])

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open)
  }

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleUserMenuClose()
    await logout()
  }

  const drawerItems = [
    { text: 'Главная', icon: <HomeIcon /> },
    { text: 'Дашборд', icon: <DashboardIcon /> },
    { text: 'Настройки', icon: <SettingsIcon /> },
    { text: 'Профиль', icon: <PersonIcon /> },
  ]

  const currentMode = themeMode === 'system' ? systemTheme : themeMode

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  // Show login/register if user is not authenticated
  if (!user) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* AppBar with Avatar and Badge */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              MUI Demo Mobile First
            </Typography>
            
            {/* Avatar with Badge */}
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#44b700',
                    border: '2px solid white',
                  }}
                />
              }
            >
              <Avatar 
                alt="User Avatar" 
                sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
                onClick={handleUserMenuOpen}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Badge>
            
            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
          >
            <Toolbar />
            <Divider />
            
            {/* Theme Switcher Section */}
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Тема оформления
              </Typography>
              
              <List dense>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleThemeChange('system')}>
                    <ListItemIcon>
                      <SystemModeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Системная" />
                    <Switch
                      edge="end"
                      checked={themeMode === 'system'}
                      onChange={() => handleThemeChange('system')}
                    />
                  </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleThemeChange('light')}>
                    <ListItemIcon>
                      <LightModeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Светлая" />
                    <Switch
                      edge="end"
                      checked={themeMode === 'light'}
                      onChange={() => handleThemeChange('light')}
                    />
                  </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleThemeChange('dark')}>
                    <ListItemIcon>
                      <DarkModeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Темная" />
                    <Switch
                      edge="end"
                      checked={themeMode === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Активная тема: {currentMode === 'dark' ? 'Темная' : 'Светлая'}
                {themeMode === 'system' && ' (системная)'}
              </Typography>
            </Box>
            
            <Divider />
            
            {/* Navigation Items */}
            <List onClick={() => toggleDrawer(false)}>
              {drawerItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
          mb: 7,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            Демонстрация компонентов MUI
          </Typography>

          {/* User Profile Section */}
          <Box sx={{ mb: 3 }}>
            <UserProfile />
          </Box>

          {/* Cards Grid */}
          <Grid container spacing={2}>
            {/* Card 1 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Карточка 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Это демонстрация компонента Card из Material-UI. 
                    Карточки идеально подходят для отображения контента.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Поделиться</Button>
                  <Button size="small">Узнать больше</Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Карточка 2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Адаптивная сетка автоматически подстраивается под размер экрана.
                    Mobile-first подход в действии!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Нравится
                  </Button>
                  <Button size="small" onClick={handleModalOpen}>
                    Открыть Modal
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Card 3 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Карточка 3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Используйте Drawer для навигации, Avatar с Badge для уведомлений,
                    и Modal для всплывающих окон.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="success">
                    Действие 1
                  </Button>
                  <Button size="small" color="success">
                    Действие 2
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Avatar Showcase Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ minHeight: 300 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Аватары с Badge
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    <Badge badgeContent={3} color="primary">
                      <Avatar sx={{ bgcolor: '#f44336' }}>A</Avatar>
                    </Badge>
                    <Badge badgeContent={10} color="secondary">
                      <Avatar sx={{ bgcolor: '#9c27b0' }}>B</Avatar>
                    </Badge>
                    <Badge badgeContent={99} color="error">
                      <Avatar sx={{ bgcolor: '#2196f3' }}>C</Avatar>
                    </Badge>
                    <Badge 
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color="success"
                    >
                      <Avatar sx={{ bgcolor: '#ff9800' }}>D</Avatar>
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Interactive Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ minHeight: 300 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Интерактивность
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Нажмите на кнопки ниже для взаимодействия с компонентами:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<MenuIcon />}
                      onClick={() => toggleDrawer(true)}
                    >
                      Открыть Drawer
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={handleModalOpen}
                    >
                      Открыть Modal
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Info Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ minHeight: 300 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Mobile First
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📱 Этот интерфейс оптимизирован для мобильных устройств
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    • Адаптивная сетка<br />
                    • Нижняя навигация<br />
                    • Drawer меню<br />
                    • Touch-friendly элементы
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Модальное окно
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Это демонстрация компонента Modal из Material-UI. 
            Модальные окна отлично подходят для отображения важной информации 
            или форм, требующих внимания пользователя.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleModalClose} variant="outlined">
              Отмена
            </Button>
            <Button onClick={handleModalClose} variant="contained">
              Ок
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }} 
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={bottomNavValue}
          onChange={(_event, newValue) => {
            setBottomNavValue(newValue)
          }}
        >
          <BottomNavigationAction label="Главная" icon={<HomeIcon />} />
          <BottomNavigationAction label="Поиск" icon={<SearchIcon />} />
          <BottomNavigationAction label="Избранное" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Профиль" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
    </ThemeProvider>
  )
}

export default App
