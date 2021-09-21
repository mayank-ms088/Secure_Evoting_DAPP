import React, {
  useEffect,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import SplashScreen from 'src/components/SplashScreen';
import { loginSuccess, logout, loginRequest, authRefresh } from 'src/core/events/userEvents';
import userService from 'src/core/api/userService';
import { useHistory } from 'react-router'

function Auth({ children }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      userService.setAxiosInterceptors({
        onLogout: () => dispatch(logout())
      });

      if (!userService.isAuthenticated()) {
        await userService.refreshAuthToken()
              .then(() => {})
              .catch((function(error) {
                history.push('/login');
              }));
      }

      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
}

Auth.propTypes = {
  children: PropTypes.any
};

export default Auth;
