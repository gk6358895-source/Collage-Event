import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we simulate a successful login
    onLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans antialiased text-gray-900">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
        
        {/* Header Decor */}
        <div className="h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 -left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay animate-pulse"></div>
              <div className="absolute bottom-0 -right-10 w-32 h-32 bg-white rounded-full mix-blend-overlay"></div>
           </div>
           <div className="z-10 text-center">
              <span className="text-4xl mb-2 block">📡</span>
               <h1 className="text-2xl font-black text-white tracking-tight">Collage Event</h1>
           </div>
        </div>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {isRegistering ? 'Join the Community' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">
              Discover and create local hyper-events
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="Gowtham..."
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <span className="absolute left-4 top-3.5 opacity-40">👤</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Gmail Address</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="name@gmail.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <span className="absolute left-4 top-4 opacity-40">✉️</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <span className="absolute left-4 top-3.5 opacity-40">🔒</span>
              </div>
            </div>

            {!isRegistering && (
              <div className="flex justify-end pr-1">
                <button type="button" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot Password?</button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gray-900 border border-black text-white rounded-3xl font-black text-sm tracking-tight shadow-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-gray-50">
            <p className="text-sm text-gray-400 font-medium">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 text-purple-600 font-bold hover:underline underline-offset-4"
              >
                {isRegistering ? 'Sign In' : 'Join Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
