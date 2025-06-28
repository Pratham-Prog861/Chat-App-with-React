import React from 'react';

const UserList = ({ users, currentUser }) => {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex items-center p-2 rounded-lg ${
            user.id === currentUser?.id
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-800">
              {user.username}
              {user.id === currentUser?.id && (
                <span className="ml-2 text-xs text-blue-600">(You)</span>
              )}
            </p>
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No other users online
        </p>
      )}
    </div>
  );
};

export default UserList; 