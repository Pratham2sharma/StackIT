import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C0C0C] to-[#1C1C1E] flex items-center justify-center p-5">
      <div className="bg-[#1C1C1E] rounded-2xl p-12 w-full max-w-md shadow-2xl border border-[#3A3A3C] animate-[slideUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)]">
        <div className="text-center mb-8 animate-[fadeInDown_0.8s_ease-out_0.2s_both]">
          <h1 className="text-3xl font-bold text-white mb-2 text-gradient">Join StackIT</h1>
          <p className="text-[#8E8E93] text-base m-0">Create your account and start asking questions</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          <div className="mb-5 animate-[slideInLeft_0.6s_ease-out_0.6s_both]">
            <label className="block text-white text-sm font-medium mb-1.5">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus:bg-[#1C1C1E] focus:-translate-y-0.5 placeholder-[#8E8E93] box-border"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-5 animate-[slideInLeft_0.6s_ease-out_0.7s_both]">
            <label className="block text-white text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus:bg-[#1C1C1E] focus:-translate-y-0.5 placeholder-[#8E8E93] box-border"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-5 animate-[slideInLeft_0.6s_ease-out_0.8s_both]">
            <label className="block text-white text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus:bg-[#1C1C1E] focus:-translate-y-0.5 placeholder-[#8E8E93] box-border"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-5 animate-[slideInLeft_0.6s_ease-out_0.9s_both]">
            <label className="block text-white text-sm font-medium mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus:bg-[#1C1C1E] focus:-translate-y-0.5 placeholder-[#8E8E93] box-border"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex flex-col items-start mb-6">
            <label className="flex items-center text-[#8E8E93] text-sm cursor-pointer">
              <input type="checkbox" required className="hidden" />
              <span className="w-4 h-4 bg-[#2C2C2E] border border-[#3A3A3C] rounded mr-2 relative transition-all duration-300 flex-shrink-0 checked:bg-[#FF6B35] checked:border-[#FF6B35]"></span>
              I agree to the <a href="/terms" className="text-[#FF6B35] no-underline transition-colors duration-300 hover:text-[#F7931E]">Terms of Service</a>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full gradient-orange text-white border-none rounded-lg py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(255,107,53,0.3)] mb-6 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] active:-translate-y-0.5 active:scale-98 active:transition-all active:duration-100 animate-[bounceIn_0.8s_ease-out_1s_both] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-[#8E8E93] text-sm animate-[fadeIn_0.8s_ease-out_1.2s_both]">
          <p>Already have an account? <a href="/login" className="text-[#FF6B35] no-underline transition-all duration-200 hover:text-[#F7931E] hover:-translate-y-0.5">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;