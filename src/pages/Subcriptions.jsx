import { useState, useEffect } from 'react';
import Layout from './Layout';

export default function Subscriptions({ user, setUser }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;
  const role = user?.role;

  useEffect(() => {
    if (userId) loadSubscriptions();
    else setLoading(false);
  }, [userId]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      let url = 'https://backend-iota-sand-32.vercel.app/api/admin/subscriptions';
      if (role !== 'admin') url += `?user_id=${userId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error cargando suscripciones');
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Layout setUser={setUser}><p>⚠️ Debes iniciar sesión para ver tus suscripciones</p></Layout>;

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Suscripciones</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : subscriptions.length === 0 ? (
          <p>No hay suscripciones para mostrar</p>
        ) : (
          <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 font-mono text-sm">{sub.license_key}</td>
                  <td className="px-6 py-4 text-sm">{sub.subscription_type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(sub.end_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
}
