import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import {supabase} from '../../config/supabaseClient'
import { Link } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Errors {
  email?: string;
  password?: string;
}

const SignInPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors when user types
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        // Here you would typically make an API call to authenticate
      }, 1500);
    }
  };
  
  // Handle social media login
  const handleSocialLogin = async () => {
    const {error}= await supabase.auth.signInWithOAuth({
     provider:"google"
    })
    if (error) alert(error.message)
     
   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4">
      <div className="bg-[#16161A] rounded-xl shadow-md p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">Welcome back</h2>
          <p className="text-[#5C5C5C] text-sm">Sign in to your account to continue</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#FFFFFF]">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#5C5C5C]" />
              </div>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-[#27272A] focus:ring-[#7C7DFF]'
                } bg-[#0A0A0B] text-[#FFFFFF] placeholder-[#6B7280] focus:outline-none focus:ring-4 focus:border-[#7C7DFF]`}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <AlertCircle size={14} className="mr-1" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
          
          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-[#FFFFFF]">
                Password
              </label>
              <a href="#forgot-password" className="text-xs font-medium text-[#7C7DFF] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#5C5C5C]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-[#27272A] focus:ring-[#7C7DFF]'
                } bg-[#0A0A0B] text-[#FFFFFF] placeholder-[#6B7280] focus:outline-none focus:ring-4 focus:border-[#7C7DFF]`}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C5C5C] hover:text-[#7C7DFF]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <AlertCircle size={14} className="mr-1" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>
          
          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-[#7C7DFF] focus:ring-[#7C7DFF] border-[#27272A] rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#FFFFFF]">
              Remember me
            </label>
          </div>
          
          {/* Sign in button */}
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7C7DFF] hover:bg-[#9191FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C7DFF] ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Sign In
          </button>
        </form>
        
        {/* Social login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272A]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#16161A] text-[#5C5C5C]">or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* Google login */}
            <button
              type="button"
              onClick={handleSocialLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-[#27272A] rounded-lg shadow-sm bg-[#16161A] text-sm font-medium text-[#5C5C5C] hover:bg-[#27272A]"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Sign up link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#5C5C5C]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#7C7DFF] hover:text-[#9191FF]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;