import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import logo from '../../img/logo-icon.png';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const authLinks = (
    <ul>
      <li>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{user ? user.name.charAt(0): "A"}</Avatar>
            <p className='px-3 font-serif text-center text-white text-xl italic'>
              {user ? user.name: ""}
            </p>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* <MenuItem onClick={handleClose}>
            Add another account
          </MenuItem> */}
          <MenuItem onClick={logout}> 
              <i className='fas fa-sign-out-alt'></i>{' '}
              <span className='hide-sm'>Logout</span>
          </MenuItem>
        </Menu>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      {/* <li>
        // <a href='#!'>Developers</a>
        <Link to='/profiles'>Developers</Link>
      </li> */}
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark border-gray-200 text-xl'>
      <h1>
        <Link to='/' className= "flex justify-center align-center items-center">
          <img src={logo} style={{width : "120px", background : "white", borderRadius : 15, marginRight : 15}}/>
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
