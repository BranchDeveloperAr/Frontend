import { useState } from "react";
import { UserPlus, Mail, Lock, User, Building, CheckCircle, AlertCircle } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    company_name: "",
    subscription_type: "trial",
    username:""
    
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-iota-sand-32.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            company_name: formData.company_name,
            subscription_type: formData.subscription_type,
            username: formData.username
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      setSuccess({
        message: "¡Cuenta creada exitosamente!",
        licenseKey: data.subscription.license_key,
        type: data.subscription.type,
        days: data.subscription.days_remaining
      });

      // Limpiar formulario
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        company_name: "",
        subscription_type: "trial"
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Únete a SAM hoy</p>
          </div>


          {/* Alertas */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 mb-2">{success.message}</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Tu License Key:</p>
                    <code className="text-sm font-mono font-bold text-green-700 break-all">
                      {success.licenseKey}
                    </code>
                    <p className="text-xs text-gray-600 mt-2">
                      Tipo: <span className="font-semibold">{success.type}</span> • 
                      Duración: <span className="font-semibold">{success.days} días</span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Guarda esta clave para activar SAM en tu computadora
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2 text-gray-500" />
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2 text-gray-500" />
                Username
              </label>
              <input
                type="text"
                placeholder="Juan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-2 text-gray-500" />
                Empresa <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Mi Laboratorio"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"              
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Tipo de suscripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Suscripción
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.subscription_type}
                onChange={(e) => setFormData({ ...formData, subscription_type: e.target.value })}
              >
                <option value="trial">🎁 Trial - 7 días gratis</option>
                <option value="monthly">📅 Mensual - 30 días</option>
                <option value="yearly">⭐ Anual - 365 días</option>
                <option value="lifetime">♾️ Lifetime - Sin vencimiento</option>
              </select>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-2 text-gray-500" />
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-2 text-gray-500" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Iniciar Sesión
              </a>
            </p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}