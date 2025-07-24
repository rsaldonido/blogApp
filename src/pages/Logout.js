import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';

export default function Logout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const notificationShown = useRef(false);

  useEffect(() => {
    if (user.id && !notificationShown.current) {
      logout();
      toast.success('Logged out successfully');
      notificationShown.current = true;
    }
    navigate('/', { replace: true });
  }, [user.id, logout, navigate]);

  return null;
}