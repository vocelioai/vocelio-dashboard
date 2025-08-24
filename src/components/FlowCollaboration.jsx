/**
 * Flow Collaboration Component
 * Real-time collaborative editing features for voice flows
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, MessageCircle, Eye, EyeOff, MousePointer, Lock, Unlock,
  UserPlus, UserMinus, Clock, Activity, AlertCircle, CheckCircle,
  Settings, Bell, BellOff, Volume2, VolumeX, Wifi, WifiOff,
  Circle, Square, Triangle, Star, Heart, Zap, Crown, Shield
} from 'lucide-react';

const FlowCollaboration = ({ flowId, currentUser, onUserAction }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [isCollaborationEnabled, setIsCollaborationEnabled] = useState(true);
  const [userPresence, setUserPresence] = useState({});
  const [activeCursors, setActiveCursors] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [comments, setComments] = useState([]);
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [permissions, setPermissions] = useState({});

  // Mock collaborators data (in real app, this would come from WebSocket/Socket.io)
  const mockCollaborators = useMemo(() => [
    {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@vocelio.ai',
      avatar: 'SC',
      role: 'admin',
      status: 'active',
      lastSeen: new Date(),
      currentNode: 'node-welcome',
      permissions: ['edit', 'comment', 'share'],
      color: '#3B82F6'
    },
    {
      id: 'user-2', 
      name: 'Marcus Rodriguez',
      email: 'marcus.r@vocelio.ai',
      avatar: 'MR',
      role: 'editor',
      status: 'editing',
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      currentNode: 'node-qualification',
      permissions: ['edit', 'comment'],
      color: '#10B981'
    },
    {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma.t@vocelio.ai',
      avatar: 'ET',
      role: 'viewer',
      status: 'viewing',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      currentNode: null,
      permissions: ['comment'],
      color: '#F59E0B'
    },
    {
      id: 'user-4',
      name: 'Alex Kumar',
      email: 'alex.kumar@vocelio.ai',
      avatar: 'AK',
      role: 'editor',
      status: 'away',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      currentNode: 'node-transfer',
      permissions: ['edit', 'comment'],
      color: '#8B5CF6'
    }
  ], []);

  // Mock comments data
  const mockComments = useMemo(() => [
    {
      id: 'comment-1',
      nodeId: 'node-welcome',
      userId: 'user-2',
      content: 'Should we add a more personalized greeting here?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false,
      replies: [
        {
          id: 'reply-1',
          userId: 'user-1',
          content: 'Good point! Let me update that.',
          timestamp: new Date(Date.now() - 25 * 60 * 1000)
        }
      ]
    },
    {
      id: 'comment-2',
      nodeId: 'node-qualification',
      userId: 'user-3',
      content: 'This qualification logic looks perfect!',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      resolved: true,
      replies: []
    }
  ], []);

  // Load collaboration data
  useEffect(() => {
    setCollaborators(mockCollaborators);
    setComments(mockComments);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setUserPresence(prev => ({
        ...prev,
        [currentUser?.id]: {
          timestamp: new Date(),
          activity: 'editing',
          cursor: { x: Math.random() * 100, y: Math.random() * 100 }
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [mockCollaborators, mockComments, currentUser]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Circle className="w-3 h-3 text-green-500 fill-current" />;
      case 'editing': return <Activity className="w-3 h-3 text-blue-500" />;
      case 'viewing': return <Eye className="w-3 h-3 text-yellow-500" />;
      case 'away': return <Circle className="w-3 h-3 text-gray-400 fill-current" />;
      default: return <Circle className="w-3 h-3 text-gray-300 fill-current" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'editor': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleInviteUser = () => {
    // Simulate inviting a new user
    console.log('Inviting new user to collaborate');
    onUserAction?.('invite_user');
  };

  const handlePermissionChange = (userId, permission, granted) => {
    setPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: granted
      }
    }));
    onUserAction?.('permission_change', { userId, permission, granted });
  };

  const addComment = (nodeId, content) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      nodeId,
      userId: currentUser?.id,
      content,
      timestamp: new Date(),
      resolved: false,
      replies: []
    };
    setComments(prev => [...prev, newComment]);
    onUserAction?.('add_comment', newComment);
  };

  const resolveComment = (commentId) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: true }
          : comment
      )
    );
    onUserAction?.('resolve_comment', { commentId });
  };

  // Collaboration Panel
  const CollaborationPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Collaboration ({collaborators.length})
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setNotifications(!notifications)}
            className={`p-2 rounded-lg transition-colors ${
              notifications 
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsCollaborationEnabled(!isCollaborationEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isCollaborationEnabled 
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'text-red-500 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {isCollaborationEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="space-y-3 mb-4">
        {collaborators.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: user.color }}
              >
                {user.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  {getRoleIcon(user.role)}
                  {getStatusIcon(user.status)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.currentNode ? `Working on ${user.currentNode}` : formatTimeAgo(user.lastSeen)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {user.status === 'editing' && (
                <Lock className="w-4 h-4 text-red-500" title="Currently editing" />
              )}
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      {/* Invite Button */}
      <button
        onClick={handleInviteUser}
        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        <span className="text-sm font-medium">Invite Collaborator</span>
      </button>
    </div>
  );

  // Comments Panel
  const CommentsPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => {
          const author = collaborators.find(u => u.id === comment.userId);
          return (
            <div key={comment.id} className={`p-3 rounded-lg border ${
              comment.resolved 
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: author?.color || '#6B7280' }}
                  >
                    {author?.avatar || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {author?.name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                
                {comment.resolved ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <button
                    onClick={() => resolveComment(comment.id)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {comment.content}
              </p>
              
              {comment.nodeId && (
                <div className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                  On: {comment.nodeId}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Presence Cursors Overlay
  const PresenceCursors = () => (
    <div className="absolute inset-0 pointer-events-none z-50">
      {Object.entries(userPresence).map(([userId, presence]) => {
        const user = collaborators.find(u => u.id === userId);
        if (!user || userId === currentUser?.id) return null;
        
        return (
          <div
            key={userId}
            className="absolute transition-all duration-300"
            style={{
              left: `${presence.cursor?.x || 50}%`,
              top: `${presence.cursor?.y || 50}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex items-center space-x-2">
              <MousePointer 
                className="w-4 h-4" 
                style={{ color: user.color }}
              />
              <div 
                className="px-2 py-1 rounded text-xs text-white font-medium"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      {/* Main Collaboration Interface */}
      <div className="space-y-4">
        <CollaborationPanel />
        <CommentsPanel />
      </div>

      {/* Presence Cursors */}
      {isCollaborationEnabled && <PresenceCursors />}

      {/* Collaboration Status Bar */}
      {isCollaborationEnabled && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-3">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} - ${user.status}`}
                >
                  {user.avatar}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
            
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white">
                {collaborators.filter(u => u.status === 'active' || u.status === 'editing').length} active
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Live collaboration
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Wifi className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowCollaboration;
