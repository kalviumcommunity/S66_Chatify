import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabaseClient';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { intent, roomCode } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Redirect back to app
        },
      });
      if (error) {
        alert(error.message);
        setIsLoading(false);
      }
      // Don't set loading to false on success because we're redirecting to Google
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  // Handle redirection after sign-in
  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoading(true);
        const token = session.access_token;
        const username = session.user.user_metadata.full_name || session.user.email;

        try {
          if (intent === 'create') {
            const response = await fetch('https://s66-chatify.onrender.com/create', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              navigate('/chat', { state: { username, roomCode: data.roomCode } });
            } else {
              setIsLoading(false);
            }
          } else if (intent === 'join' && roomCode) {
            const response = await fetch(`https://s66-chatify.onrender.com/roomcode/${roomCode}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              navigate('/chat', { state: { username, roomCode } });
            } else {
              setIsLoading(false);
            }
          } else {
            navigate('/'); // Default to landing page
          }
        } catch (error) {
          console.error('Redirection error:', error);
          setIsLoading(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleRedirect();
      }
    });

    handleRedirect(); // Check immediately on mount

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [intent, roomCode, navigate]);

  // Loading overlay component
  const LoadingOverlay = () => {
    if (!isLoading) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-white text-xl font-medium">Connecting...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4">
      <LoadingOverlay />
      <div className="bg-[#16161A] rounded-xl shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">Welcome back</h2>
          <p className="text-[#5C5C5C] text-sm">Sign in to your account to continue</p>
        </div>

        <div className="mt-6">
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleSocialLogin}
              disabled={isLoading}
              className={`w-full inline-flex justify-center items-center py-2 px-4 border border-[#27272A] rounded-lg shadow-sm bg-[#16161A] text-sm font-medium text-[#5C5C5C] hover:bg-[#27272A] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              Sign in with Google
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                className="w-5 h-5 ml-2"
              >
                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;