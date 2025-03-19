
import React, { useState } from 'react';
import { MessageSquare, Users, Lock, Zap, ArrowRight, X } from 'lucide-react';
import axios from 'axios';

function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    roomCode: ''
  });

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      setLoginData(prev => ({ ...prev, roomCode }));
      setShowLogin(true);
    }
  };

  const createRoom = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create');
      setRoomCode(response.data.roomCode);
      console.log(response.data.roomCode)
      setShowLogin(true);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };
  
  const handleCreateRoom = () => {
    createRoom();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', loginData);
  };

  const navigateToSignIn = () => {
    window.location.href = '/signin';
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#16161A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#242629] rounded-xl shadow-xl p-8 relative">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Join Chat Room</h2>
            <p className="text-gray-400">
  {roomCode ? `Room Code: ${roomCode}` : 'Create a new room'}
</p>

          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#16161A] border border-[#2e2e35] focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Join Chat
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#242629] text-gray-400">or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Want to save your chat history?
              </p>
              <button
                type="button"
                onClick={navigateToSignIn}
                className="w-full px-6 py-3 bg-[#16161A] border border-purple-500 hover:bg-purple-500/10 rounded-lg font-medium transition-colors"
              >
                Sign in to your account
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16161A]">
      {/* Hero Section */}
      <div className="relative hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Connect Instantly with
              <span className="gradient-text"> Chatify</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Create or join real-time chat rooms in seconds. No registration required.
              Just start chatting with friends, family, or colleagues.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-6 py-3 rounded-lg bg-[#242629] border border-[#2e2e35] focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
              />
              <button 
                onClick={handleJoinRoom}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Join Room <ArrowRight size={20} />
              </button>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleCreateRoom}
                className="text-purple-400 hover:text-purple-300 font-medium"
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
            Join thousands of users who are already connecting through Chatify.
            No downloads, no registration - just instant communication.
          </p>
          <button 
            onClick={handleCreateRoom}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium inline-flex items-center gap-2"
          >
            Create a Room <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;