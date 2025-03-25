import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Lock, Zap, ArrowRight, Loader2 } from 'lucide-react';
import axios, { AxiosResponse } from 'axios';
import { supabase } from '../../config/supabaseClient'; // Import Supabase client

function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to get token and make authenticated requests
  const makeAuthenticatedRequest = async (
    url: string, 
    method: 'get' | 'post' = 'get', 
    data: any = null
  ): Promise<AxiosResponse | null> => {
    setIsLoading(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      
      if (!session) {
        navigate('/signin', { state: { intent: method === 'post' ? 'create' : 'join', roomCode } });
        return null;
      }

      const token = session.access_token;
      const response = await axios({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error: any) {
      console.error(`Error in ${method} request:`, error);
      if (error.response?.status === 401) {
        navigate('/signin', { state: { intent: method === 'post' ? 'create' : 'join', roomCode } });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle joining a room
  const handleJoinRoom = async () => {
    if (!roomCode.trim() || isLoading) return;

    const response = await makeAuthenticatedRequest(`https://s66-chatify.onrender.com/roomcode/${roomCode}`);
    if (response) {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      
      if (session && session.user) {
        const username = session.user.user_metadata?.full_name || session.user.email;
        navigate('/chat', { state: { username, roomCode } });
      }
    }
  };

  // Handle creating a room
  const handleCreateRoom = async () => {
    if (isLoading) return;
    
    const response = await makeAuthenticatedRequest('https://s66-chatify.onrender.com/create', 'post');
    if (response) {
      const newRoomCode = response.data.roomCode;
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      
      if (session && session.user) {
        const username = session.user.user_metadata?.full_name || session.user.email;
        setRoomCode(newRoomCode);
        navigate('/chat', { state: { username, roomCode: newRoomCode } });
      }
    }
  };

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
    <div className="min-h-screen bg-[#16161A]">
      <LoadingOverlay />
      
      {/* Hero Section */}
      <div className="relative hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Connect Instantly with
              <span className="gradient-text"> Chatify</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Create or join real-time chat rooms in seconds. Sign in with Google to start chatting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-6 py-3 rounded-lg bg-[#242629] border border-[#2e2e35] focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleJoinRoom}
                className={`w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Join Room <ArrowRight size={20} />
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateRoom}
                className={`text-purple-400 hover:text-purple-300 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                or create a new room →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card">
            <MessageSquare className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-400">
              Instant message delivery with real-time typing indicators and notifications
            </p>
          </div>
          <div className="feature-card">
            <Users className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Group Chats</h3>
            <p className="text-gray-400">
              Create rooms for teams, events, or casual conversations with multiple participants
            </p>
          </div>
          <div className="feature-card">
            <Lock className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-400">
              End-to-end encryption ensures your conversations stay private and secure
            </p>
          </div>
          <div className="feature-card">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Optimized performance for smooth chatting experience across all devices
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start chatting?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users connecting through Chatify with Google Sign-In.
          </p>
          <button
            onClick={handleCreateRoom}
            className={`px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium inline-flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Create a Room <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;