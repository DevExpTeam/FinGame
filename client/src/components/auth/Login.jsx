import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
// import { setAlert } from '../../actions/alert';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormdata] = useState({
    email: '',
    password: '',
  });

  // Pull name, email, passowrd from formData
  const { email, password } = formData;

  const onChange = (e) =>
    setFormdata({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if Logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <section class="bg-gray-100 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0" style={{height : "95vh"}}>
            <a href="#" class="font-serif flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Sign In to GameBoard
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign into your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" onSubmit={(e) => onSubmit(e)}>
                      
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input 
                              type="email" 
                              name="email" 
                              id="email" 
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                              placeholder="name@company.com"
                              value={email}
                              onChange={(e) => onChange(e)}
                              required 
                            />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                              type="password" 
                              name="password" 
                              id="password" 
                              placeholder="" 
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                              value={password}
                              onChange={(e) => onChange(e)}
                              minLength='6'
                              required 
                            />
                        </div>
                        <button type="submit" class="w-full text-white rounded-lg text-sm px-5 py-2.5 text-center btn btn-primary">Login</button>      
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account? <Link to='/register' class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up</Link> 
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </Fragment>
  );
};
Login.propTypes = {
  // setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// export default connect(mapStateToProps, { setAlert, login })(Login);
export default connect(mapStateToProps, { login })(Login);

