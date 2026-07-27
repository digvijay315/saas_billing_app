import { User, Lock, Save, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <div className="max-w-4xl pb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your admin profile and security preferences.</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="px-6 pb-6 sm:px-10 sm:pb-10 relative">
          {/* Avatar overlaying banner */}
          <div className="flex justify-between items-end -mt-12 mb-8 relative z-10">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600">
                  <User className="w-10 h-10" />
                </div>
              </div>
              <div className="pb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Super Admin</h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 border border-blue-100">
                  <Shield className="w-3 h-3" />
                  Owner
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Section */}
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Profile Information</h4>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      disabled 
                      value="admin@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm focus:outline-none cursor-not-allowed font-medium" 
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Primary administrative email cannot be changed here.
                  </p>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Security</h4>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="button"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
