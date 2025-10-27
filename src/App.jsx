import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterUser from './pages/Register';
import Subscriptions from './pages/Subcriptions';
import Layout from './pages/Layout';


function App() {
  const [user, setUser] = useState(null);
  console.log(user)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      {user ? (
        <Layout setUser={setUser}>
          <Routes>
            <Route path="/subscriptions" element={<Subscriptions user={user} />} />
             <Route path="/register" element={<RegisterUser />} />
            <Route path="*" element={<Navigate to="/subscriptions" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
