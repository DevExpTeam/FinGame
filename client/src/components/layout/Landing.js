import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Financial Games</h1>
          <p className='lead'>
            {/* Create a developer profile/portfolio, share posts and get help from
            other developers */}
          </p>
          <Stack direction="row" spacing={2}>
            <Link to='/register'>
              <Button variant="contained" href="/register">
                Sign Up
              </Button>
            </Link>
            <Link to='/login'>
              <Button variant="contained" color="success" href="/register">
                Login
              </Button>
            </Link>
          </Stack>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);