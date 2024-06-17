import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import PrivateRoute from './components/routing/PrivateRoute';
import GameDashboard1 from './components/gameboard/Gameboard1';
import './index.css';
import './main.css';

//Redux
import { Provider } from 'react-redux';
import store from'./store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import { createTheme, Divider, IconButton, Link, List, ListItemButton, ThemeProvider, Toolbar, Box , Container, Drawer, styled} from '@mui/material';
import { CustomAppBar, CustomDrawer } from './components/templates/CustomAppBar';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const defaultTheme = createTheme()

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const App = () => {
  const [toggleOpen, setToggleOpen] = React.useState(true);
  const toggleDrawer = () => {
    setToggleOpen(!toggleOpen);
  };

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store} >
      <Router>
      <ThemeProvider theme={defaultTheme}>
        <Box  >
        <CustomAppBar position="absolute" open={toggleOpen}>
            <Toolbar
                sx={{
                pr: '24px', // keep right padding when drawer closed,
                backgroundColor: "#003c71"
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(toggleOpen && { display: 'none' }),
                    }}
                >
                <MenuIcon />
                </IconButton>
                <Navbar />      
                </Toolbar>
            
            </CustomAppBar>
          
      
          <Drawer 
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }} 
              variant="persistent" 
              anchor="left"
              open={toggleOpen}
          > 
              <Toolbar
                  sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
                  }}
              >
                  <IconButton onClick={toggleDrawer} style={{color: "white", background : "black"}}>
                      <ChevronLeftIcon />
                  </IconButton>
              </Toolbar>
              <List component="nav">
                    <ListItemButton>
                      <Link to='/GameBoard1'>
                        GameBoard1
                      </Link>
                    </ListItemButton>
                  
                  
                <Divider sx={{ my: 1 }} />
              </List>    
          </Drawer>

          <Box
              component="main"
              sx={{
                  backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
              }}
          >

              <Toolbar />
              <Container>
              
              <Fragment>
                
                <Route exact path='/' component={Landing} />
                <section>
                  <Alert />
                  <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/profiles' component={Profiles} />
                    <Route exact path='/profile/:id' component={Profile} />
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    <PrivateRoute exact path = "/Gameboard1" component = {GameDashboard1} />
                    <PrivateRoute
                      exact
                      path='/create-profile'
                      component={CreateProfile}
                    />
                    <PrivateRoute
                      exact
                      path='/edit-profile'
                      component={EditProfile}
                    />
                    <PrivateRoute
                      exact
                      path='/add-experience'
                      component={AddExperience}
                    />
                    <PrivateRoute
                      exact
                      path='/add-education'
                      component={AddEducation}
                    />
                    <PrivateRoute exact path='/posts' component={Posts} />
                    <PrivateRoute exact path='/posts/:id' component={Post} />
                  </Switch>
                  <Redirect from='*' to='/' component={Landing} />
                </section>
              </Fragment>
              {/* <Footer /> */}
            
              </Container>
          </Box>
          
        
        </Box>
        </ThemeProvider>
        </Router>
      </Provider>
  );
}

export default App;