import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 items-center justify-center">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500 blur-[120px]"></div>
          <div className="absolute top-[60%] left-[50%] w-[50%] h-[50%] rounded-full bg-indigo-500 blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 p-12 text-center text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md inline-block mb-6 shadow-xl border border-white/20">
              <Building2 className="w-16 h-16 text-blue-300" />
            </div>
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Secure Billing Pro</h1>
            <p className="text-lg text-blue-100/80 leading-relaxed font-light">
              The ultimate premium administrative dashboard to manage your hotels, track subscriptions, and scale your business securely.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm">Please sign in to your admin account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin@123"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Sign In to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
