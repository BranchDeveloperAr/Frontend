import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, LogOut } from 'lucide-react';

export default function Layout({ children, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('subscription');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold text-primary">SAM Admin</span>
              <div className="flex gap-4">                
                <Link to="/subscriptions" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <CreditCard className="w-5 h-5" />
                  Suscripciones
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <LayoutDashboard className="w-5 h-5" />
                  Registrar
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
