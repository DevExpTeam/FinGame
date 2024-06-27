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
import GameDashboard1 from './components/gameboard/DebitOrCredit';
import GameDashboard2 from './components/gameboard/TAccount';
import './index.css';
import './main.css';

//Redux
import { Provider } from 'react-redux';
import store from'./store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import { createTheme, Divider, IconButton, List, ListItemButton, ThemeProvider, Toolbar, Box , Container, Drawer, styled} from '@mui/material';
import { CustomAppBar } from './components/templates/CustomAppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const defaultTheme = createTheme()

const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const App = () => {
  const [toggleOpen, setToggleOpen] = React.useState(false);
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
          <Box>
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
                <MenuIcon style={{width : 40, height: 40}} />
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
                  textAlign: "center",
                  justifyContent: 'flex-end',
                  px: [1],
                  }}
              >   
                <p className="font-serif text-2xl font-semibold" style={{marginRight: 10}}>Games List</p> 
                <IconButton onClick={toggleDrawer} style={{color: "white", background : "black"}}>
                    <ChevronLeftIcon style={{width : 30, height: 30}}/>
                </IconButton>
              </Toolbar>
              <List component="nav" className='text-xl font-serif'>
                <Link to='/GameBoard1'>
                  <ListItemButton>
                    <SportsEsportsRoundedIcon style={{marginRight: 5, width : 30, height: 30}} />
                    Debit or Credit
                  </ListItemButton>
                  </Link>
                  <Link to='/GameBoard2'>
                  <ListItemButton>
                    <SportsEsportsRoundedIcon style={{marginRight: 5, width : 30, height: 30}} />
                    T Account
                  </ListItemButton>
                  </Link>
                  {/* <Link to='/GameBoard3'>
                    <ListItemButton>
                      <SportsEsportsRoundedIcon style={{marginRight: 5, width : 30, height: 30}} />
                        GameBoard3    
                    </ListItemButton>
                  </Link> */}
                <Divider sx={{ my: 1 }} />
              </List>
            </Drawer>
            {/*  */}
            <Main open={toggleOpen} style={{padding: 0}}>
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
                  paddingLeft: "10%"
                }}
              >
                <Toolbar/>
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
                        <PrivateRoute exact path = "/Gameboard2" component = {GameDashboard2} />
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
            </Main>
          </Box>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;