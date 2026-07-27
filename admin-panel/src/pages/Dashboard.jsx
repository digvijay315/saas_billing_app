import { Building2, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const stats = [
    { name: 'Total Hotels', value: '24', icon: <Building2 className="w-6 h-6 text-white" />, change: '+3 this month', color: 'from-blue-500 to-blue-600' },
    { name: 'Active Subscriptions', value: '20', icon: <Activity className="w-6 h-6 text-white" />, change: '83% retention', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Total Revenue', value: '$12,450', icon: <DollarSign className="w-6 h-6 text-white" />, change: '+15% this month', color: 'from-violet-500 to-violet-600' },
    { name: 'Total Users', value: '145', icon: <Users className="w-6 h-6 text-white" />, change: '+22 this week', color: 'from-amber-500 to-amber-600' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Here is what is happening with your hotels today.</p>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl shadow-sm bg-gradient-to-br ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change.split(' ')[0]}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Hotel Paradise {i+1} joined</p>
                  <p className="text-xs text-slate-500 mt-0.5">2 hours ago • Basic Plan</p>
                </div>
              </div>
              <span className="self-start sm:self-center text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold border border-blue-200">
                New Subscription
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
