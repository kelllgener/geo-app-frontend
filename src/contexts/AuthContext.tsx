import { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || 'http://geo-app.test';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // try fetch current user
      axios.get(`${API}/api/me`).then(res => {
        setUser(res.data);
      }).catch(() => {
        // token invalid -> logout
        logout();
      });
    }
  }, [token]);

  function login(email:string, password:string) {
    return axios.post(`${API}/api/login`, { email, password })
      .then(res => {
        const t = res.data.token;
        localStorage.setItem('token', t);
        setToken(t);
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        setUser(res.data.user);
        navigate('/Home');
      });
  }

  function storeIpAddress(ip_address: string) {
    return axios.post(`${API}/api/ipinfo`, {ip_address})
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error("Error saving Ip address: ", err.response?.data || err.message);
        throw err;
      })
  }

  function logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    navigate('/login');
  }

  return <AuthContext.Provider value={{ token, user, login, logout, storeIpAddress }}>{children}</AuthContext.Provider>
}
