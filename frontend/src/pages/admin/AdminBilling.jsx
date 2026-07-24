import React, { useState, useEffect } from "react";
import { CreditCard, Check, Zap, Shield, Crown } from "lucide-react";
import { authAPI } from "../../api";
import Swal from "sweetalert2";

export default function AdminBilling() {
  const [currentPlan, setCurrentPlan] = useState("none");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      if (user.subscriptionPlan) {
        setCurrentPlan(user.subscriptionPlan);
      }
    }
  }, []);

  const handleActivatePlan = async (planName) => {
    try {
      const res = await authAPI.updateSubscription({ plan: planName, status: "active" });
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Successfully activated ${planName} plan!`,
          background: '#0f172a',
          color: '#f8fafc',
          customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded' },
          buttonsStyling: false
        });
        setCurrentPlan(res.data.subscriptionPlan);
        
        // Update local storage
        if (currentUser) {
          const updatedUser = { 
            ...currentUser, 
            subscriptionPlan: res.data.subscriptionPlan,
            subscriptionStatus: res.data.subscriptionStatus,
            subscriptionExpiresAt: res.data.subscriptionExpiresAt 
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          window.dispatchEvent(new Event("user-updated"));
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Failed to update subscription",
        background: '#0f172a',
        color: '#f8fafc',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded' },
        buttonsStyling: false
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto min-h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <CreditCard className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Subscription & Billing</h1>
          <p className="text-sm text-slate-400">Manage your SAAS billing plans and upgrades</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        {/* Free Tier */}
        <div className={`glass border rounded-3xl p-8 relative flex flex-col ${currentPlan === 'free' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800/50'}`}>
          {currentPlan === 'free' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold px-4 py-1 rounded-full text-sm">
              Current Plan
            </div>
          )}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Free Tier</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">₹0</span>
              <span className="text-slate-400">/ forever</span>
            </div>
            <p className="text-sm text-slate-400 mt-4">Perfect for getting started and testing the system.</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4">
              {[
                "Basic Restaurant Billing",
                "Up to 50 Receipts / day",
                "1 Admin Account",
                "Basic Reporting",
                "Standard Email Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            disabled={currentPlan === 'free'}
            onClick={() => handleActivatePlan('free')}
            className={`mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-all ${
              currentPlan === 'free' 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {currentPlan === 'free' ? 'Active' : 'Activate Free Tier'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className={`glass border rounded-3xl p-8 relative flex flex-col ${currentPlan === 'pro' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-gold-800/30'}`}>
          <div className="absolute -top-4 right-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg shadow-amber-500/20">
            <Crown className="w-4 h-4" /> Recommended
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-2 flex items-center gap-2">
              Premium Plan <Zap className="w-5 h-5 text-amber-500" />
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">₹1,499</span>
              <span className="text-slate-400">/ month</span>
            </div>
            <p className="text-sm text-slate-400 mt-4">Unlimited access to all features to grow your business.</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4">
              {[
                "Unlimited Restaurant Billing",
                "Room & Advance Bookings",
                "Unlimited Staff Accounts",
                "Advanced Analytics & Exports",
                "24/7 Priority WhatsApp Support",
                "Custom Branding & Logo"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            disabled={currentPlan === 'premium'}
            className={`mt-8 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              currentPlan === 'premium'
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-600/20 active:scale-95'
            }`}
            onClick={() => handleActivatePlan('premium')}
          >
            {currentPlan === 'premium' ? 'Active' : 'Upgrade Now'}
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center max-w-2xl mx-auto glass p-6 rounded-2xl border border-slate-800/50">
        <Shield className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <h4 className="text-slate-200 font-medium mb-2">Secure Payments</h4>
        <p className="text-sm text-slate-500">
          All transactions are secure and encrypted. You can cancel your subscription at any time. For enterprise volume pricing, please contact our sales team.
        </p>
      </div>
    </div>
  );
}
