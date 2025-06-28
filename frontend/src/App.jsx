import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Send, User, MessageCircle, LogOut, Users } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import UserList from './components/UserList';
import LoginModal from './components/LoginModal';

const socket = io('http://localhost:3000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setShowLogin(false);
      socket.emit('user-join', userData);
    }

    // Socket event listeners
    socket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user-joined', (userData) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `${userData.username} joined the chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('user-left', (userData) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `${userData.username} left the chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('users-list', (usersList) => {
      console.log('Received users list:', usersList); // Debug log
      setUsers(usersList);
    });

    return () => {
      socket.off('message');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('users-list');
    };
  }, []);

  const handleLogin = (username) => {
    const userData = {
      id: Date.now().toString(),
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    };
    setUser(userData);
    setShowLogin(false);
    localStorage.setItem('chatUser', JSON.stringify(userData));
    socket.emit('user-join', userData);
  };

  const handleLogout = () => {
    socket.emit('user-leave', user);
    setUser(null);
    setMessages([]);
    setUsers([]);
    setShowLogin(true);
    localStorage.removeItem('chatUser');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && user) {
      const message = {
        id: Date.now().toString(),
        content: messageInput.trim(),
        user: user,
        timestamp: new Date().toISOString()
      };
      socket.emit('message', message);
      setMessageInput('');
    }
  };

  if (showLogin) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Online
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">{user.username}</p>
              <p className="text-sm text-gray-500">You</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-gray-700">Online Users</h2>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Users size={16} />
              </button>
            </div>
            {showUserList && (
              <UserList users={users} currentUser={user} />
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.user?.id === user?.id}
              />
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;