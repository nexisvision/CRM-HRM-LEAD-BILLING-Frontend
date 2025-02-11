import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaUser, FaPaperPlane } from "react-icons/fa";
import { BsCheck, BsCheckAll, BsEmojiSmile, BsThreeDotsVertical, BsPencil, BsTrash, BsClipboard } from "react-icons/bs";
import socketService from 'services/SocketService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmojiPicker from 'emoji-picker-react';

dayjs.extend(relativeTime);

// Add this component for group header
const GroupHeader = ({ group }) => {
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const allUserData = useSelector((state) => state.Users);
  const users = allUserData.Users?.data || [];

  // Format member names to show first 3 members and total count
  const formatMemberNames = (members) => {
    if (!members || members.length === 0) return 'No members';

    // Get full user objects by matching member IDs with users data
    const memberUsers = members.map(memberId => {
      const user = users.find(u => u.id === memberId);
      return user || { id: memberId };
    });

    // Remove the current user from the display list
    const otherMembers = memberUsers.filter(member => member.id !== loggedInUser.id);

    const formatName = member => {
      if (!member || (!member.firstName && !member.lastName && !member.username)) {
        const pendingUser = users.find(u => u.id === member.id);
        if (pendingUser) {
          return pendingUser.firstName
            ? `${pendingUser.firstName} ${pendingUser.lastName || ''}`
            : pendingUser.username;
        }
        return 'Loading...';
      }

      if (member.firstName && member.lastName) {
        return `${member.firstName} ${member.lastName}`;
      } else if (member.firstName) {
        return member.firstName;
      } else if (member.username) {
        return member.username;
      }
      return member.email || 'Loading...';
    };

    const memberNames = otherMembers.map(formatName).filter(name => name !== 'Loading...');

    if (memberNames.length <= 2) {
      return memberNames.join(', ');
    }

    return `${memberNames.slice(0, 2).join(', ')} and ${memberNames.length - 2} ${memberNames.length - 2 === 1 ? 'other' : 'others'}`;
  };

  return (
    <div className="flex items-center flex-1 min-w-0">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-white text-lg font-medium">
            {group.name?.charAt(0).toUpperCase() || 'G'}
          </span>
        </div>
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {group.name || 'Group Chat'}
          </h2>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600 whitespace-nowrap">
            {group.members?.length || 0} {group.members?.length === 1 ? 'member' : 'members'}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-0.5 truncate">
          {formatMemberNames(group.members)}
        </div>
      </div>
    </div>
  );
};

// Add this component for user header
const UserHeader = ({ user, isTyping, userStatus, getRoleBadgeColor, getRoleName, formatLastSeen }) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-white text-xl" />
          )}
        </div>
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${userStatus.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        />
      </div>
      <div className="ml-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {user.firstName
              ? `${user.firstName} ${user.lastName || ''}`
              : user.username}
          </h2>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role_id)}`}>
            {getRoleName(user.role_id)}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-0.5">
          {isTyping ? (
            <span className="text-blue-500 font-medium flex items-center">
              Typing
              <span className="typing-animation ml-1">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </span>
          ) : (
            <span className={`text-sm ${userStatus.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
              {userStatus.isOnline ? 'Active now' : formatLastSeen(userStatus.lastSeen)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChatContent({ selectedUser }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role.role.data || []);
  const [userStatus, setUserStatus] = useState({ isOnline: false, lastSeen: null });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [activeContextMenu, setActiveContextMenu] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;

    const newSocket = socketService.connect();
    setSocket(newSocket);

    // Clear messages when changing users
    setMessages([]);
    // Reset typing status when changing users
    setIsTyping(false);

    // Join room and mark messages as read immediately
    newSocket.emit('user_connected', loggedInUser.id);

    // Get existing conversations with correct status
    newSocket.emit('get_conversations', { userId: loggedInUser.id });

    // Mark messages as read immediately when opening chat
    newSocket.emit('mark_messages_read', {
      sender_id: selectedUser.id,
      receiver_id: loggedInUser.id
    });

    // Save last opened chat
    localStorage.setItem('selectedChatUser', selectedUser.id.toString());

    // Listen for typing status
    newSocket.on('user_typing', ({ userId, isTyping: typing }) => {
      console.log('Received typing status:', { userId, typing }); // Debug log
      if (userId === selectedUser.id) {
        setIsTyping(typing);
      }
    });

    // Listen for received conversations
    newSocket.on('conversations_received', (conversations) => {
      if (conversations && conversations[selectedUser.id]) {
        const uniqueMessages = conversations[selectedUser.id]
          .filter((message, index, self) =>
            index === self.findIndex((m) => m.timestamp === message.timestamp)
          )
          .map(msg => {
            // Set correct initial status
            if (msg.sender_id === loggedInUser.id) {
              return { ...msg, status: msg.status || 'sent' };
            }
            // Mark all received messages as read
            if (msg.sender_id === selectedUser.id) {
              return { ...msg, status: 'read' };
            }
            return msg;
          });

        setMessages(uniqueMessages);
      }
    });

    // Listen for new messages
    newSocket.on('receive_message', (data) => {
      const { user_id, message } = data;

      // Only add message if it's from the current chat
      if (message.sender_id === selectedUser.id || message.sender_id === loggedInUser.id) {
        setMessages(prev => {
          // Check if message already exists
          const messageExists = prev.some(m => m.timestamp === message.timestamp);
          if (messageExists) return prev;

          // Mark received messages as read
          if (message.sender_id === selectedUser.id) {
            newSocket.emit('mark_messages_read', {
              sender_id: selectedUser.id,
              receiver_id: loggedInUser.id
            });
          }

          return [...prev, message];
        });
      }
    });

    // Listen for message status updates
    newSocket.on('message_status_updated', ({ message_timestamp, status }) => {
      setMessages(prev => prev.map(msg =>
        msg.timestamp === message_timestamp ? { ...msg, status } : msg
      ));
    });

    // Listen for deleted messages
    newSocket.on('message_deleted', ({ message_timestamp }) => {
      setMessages(prev => prev.filter(msg => msg.timestamp !== message_timestamp));
    });

    newSocket.on('users_status', (data) => {
      const { userStatus: allUserStatus } = data;
      const currentUserStatus = allUserStatus[selectedUser.id] || {
        isOnline: false,
        lastSeen: null
      };
      setUserStatus(currentUserStatus);
    });

    newSocket.on('message_edited', ({ message_timestamp, new_message }) => {
      setMessages(prev => prev.map(msg =>
        msg.timestamp === message_timestamp
          ? { ...msg, message: new_message, edited: true }
          : msg
      ));
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      newSocket.off('user_typing');
      newSocket.off('conversations_received');
      newSocket.off('receive_message');
      newSocket.off('message_status_updated');
      newSocket.off('message_deleted');
      newSocket.off('users_status');
      newSocket.off('message_edited');
    };
  }, [selectedUser?.id, loggedInUser.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Normalize spaces and trim
    const trimmedMessage = messageInput.replace(/\s+/g, ' ').trim();
    if (!trimmedMessage || !selectedUser) return;

    if (editingMessage) {
      // Handle edit
      const editData = {
        message_timestamp: editingMessage.timestamp,
        new_message: trimmedMessage, // Use normalized message
        sender_id: loggedInUser.id,
        receiver_id: selectedUser.id
      };

      setIsLoading(true);
      try {
        socket.emit('edit_message', editData);
        setEditingMessage(null);
        setMessageInput('');
      } catch (error) {
        console.error('Error editing message:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle new message
      const messageData = {
        sender_id: loggedInUser.id,
        receiver_id: selectedUser.id,
        message: trimmedMessage, // Use normalized message
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setIsLoading(true);
      try {
        setMessages(prev => [...prev, messageData]);
        setMessageInput(''); // Clear input after sending

        await socketService.sendMessage(messageData);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => prev.filter(msg => msg.timestamp !== messageData.timestamp));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      console.log('Emitting typing start...'); // Debug log
      socket.emit('typing', {
        sender_id: loggedInUser.id,
        receiver_id: selectedUser.id,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log('Emitting typing stop...'); // Debug log
      socket.emit('typing', {
        sender_id: loggedInUser.id,
        receiver_id: selectedUser.id,
        isTyping: false
      });
    }, 1500);
  };

  // Add cleanup for typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <BsCheck className="text-gray-400 w-4 h-4" />;
      case 'delivered':
        return <BsCheckAll className="text-gray-400 w-4 h-4" />;
      case 'read':
        return <BsCheckAll className="text-blue-500 w-4 h-4" />;
      default:
        return <BsCheck className="text-gray-400 w-4 h-4" />; // Default to sent status
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(role => role.id === roleId);
    return role?.role_name || 'User';
  };

  const getRoleBadgeColor = (roleId) => {
    const roleName = getRoleName(roleId)?.toLowerCase();

    switch (roleName) {
      case 'super-admin':
        return 'bg-purple-100 text-purple-700';
      case 'client':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    const messageDate = dayjs(timestamp);
    const today = dayjs();

    if (messageDate.isSame(today, 'day')) {
      return messageDate.format('HH:mm');
    } else if (messageDate.isSame(today.subtract(1, 'day'), 'day')) {
      return 'Yesterday ' + messageDate.format('HH:mm');
    } else {
      return messageDate.format('DD/MM/YY HH:mm');
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach(message => {
      const date = dayjs(message.timestamp).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  // Format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Inactive';

    const now = dayjs();
    const lastSeen = dayjs(timestamp);

    if (now.diff(lastSeen, 'minute') < 1) return 'Just now';
    if (now.diff(lastSeen, 'hour') < 24) return `Last seen ${lastSeen.fromNow()}`;
    if (now.diff(lastSeen, 'day') < 7) return `Last seen ${lastSeen.format('dddd [at] HH:mm')}`;
    return `Last seen ${lastSeen.format('DD MMM YYYY [at] HH:mm')}`;
  };

  // Add context menu component
  const MessageContextMenu = ({ x, y, onEdit, onDelete, onCopy, isOwnMessage }) => {
    return (
      <div
        className="fixed bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
        style={{ top: y, left: x }}
      >
        <button
          onClick={onCopy}
          className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-1`"
        >
          <BsClipboard className="w-4 h-4" />
          <span>Copy</span>
        </button>
        {isOwnMessage && (
          <>
            <button
              onClick={onEdit}
              className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
            >
              <BsPencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-1"
            >
              <BsTrash className="w-4 h-4" />
              <span>Unsend</span>
            </button>
          </>
        )}
      </div>
    );
  };

  // Update MessageItem component
  const MessageItem = ({ message }) => {
    const isOwnMessage = message.sender_id === loggedInUser.id;

    // Handle right click
    const handleContextMenu = (e) => {
      if (isOwnMessage) {
        e.preventDefault();
        // Close any existing context menu and open new one
        setActiveContextMenu({
          messageId: message.timestamp,
          x: e.pageX,
          y: e.pageY,
        });
      }
    };

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (activeContextMenu && !e.target.closest('.message-context-menu')) {
          setActiveContextMenu(null);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [activeContextMenu]);

    const handleEdit = () => {
      setEditingMessage(message);
      // Normalize spaces when setting message for edit
      setMessageInput(message.message.replace(/\s+/g, ' ').trim());
      setActiveContextMenu(null);
    };

    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to unsend this message?')) {
        try {
          await socket.emit('delete_message', {
            message_timestamp: message.timestamp,
            sender_id: loggedInUser.id,
            receiver_id: selectedUser.id
          });
          setActiveContextMenu(null);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }
    };

    // Add copy handler
    const handleCopy = () => {
      navigator.clipboard.writeText(message.message)
        .then(() => {
          // Optional: Show a toast notification
          setActiveContextMenu(null);
        })
        .catch((err) => {
          console.error('Failed to copy text:', err);
        });
    };

    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div
          className="flex flex-col max-w-[70%] relative"
          onContextMenu={handleContextMenu}
        >
          {/* Context Menu */}
          {activeContextMenu?.messageId === message.timestamp && (
            <div className="message-context-menu">
              <MessageContextMenu
                x={activeContextMenu.x}
                y={activeContextMenu.y}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                isOwnMessage={isOwnMessage}
                onClose={() => setActiveContextMenu(null)}
              />
            </div>
          )}

          {/* Edited indicator */}
          {message.edited && (
            <div className={`text-xs mb-1 ${isOwnMessage ? 'text-right text-blue-400' : 'text-gray-400'}`}>
              edited
            </div>
          )}

          {/* Message Content */}
          <div className={`px-4 py-2.5 shadow-sm ${isOwnMessage
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl rounded-l-2xl'
            : 'bg-white text-gray-800 rounded-t-2xl rounded-r-2xl'
            }`}>
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {message.message}
            </p>
          </div>

          {/* Message Status */}
          <div className={`mt-1 flex items-center space-x-2 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{formatMessageTime(message.timestamp)}</span>
            </div>
            {isOwnMessage && (
              <div className="flex items-center">
                {getMessageStatus(message.status)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add click outside handler for emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    const cursor = messageInput.length;
    const text = messageInput.slice(0, cursor) + emojiObject.emoji + messageInput.slice(cursor);
    setMessageInput(text);
    setShowEmojiPicker(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-500">
          Select a user to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-[72px] flex-shrink-0 px-6 flex items-center justify-between border-b border-gray-200 bg-white z-10 relative">
        {selectedUser.isGroup ? (
          <GroupHeader group={selectedUser} />
        ) : (
          <UserHeader
            user={selectedUser}
            isTyping={isTyping}
            userStatus={userStatus}
            getRoleBadgeColor={getRoleBadgeColor}
            getRoleName={getRoleName}
            formatLastSeen={formatLastSeen}
          />
        )}

        {/* Optional: Add group actions menu */}
        {selectedUser.isGroup && (
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <BsThreeDotsVertical className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Container - Update z-index */}
      <div className="flex-1 relative z-0">
        <div
          className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-[#F8FAFF]"
          style={{
            height: '100%' // This will fill the remaining space automatically
          }}
        >
          {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="text-center">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  {dayjs(date).isSame(dayjs(), 'day')
                    ? 'Today'
                    : dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
                      ? 'Yesterday'
                      : dayjs(date).format('DD MMMM YYYY')}
                </span>
              </div>
              {dateMessages.map((message) => (
                <MessageItem key={message.timestamp} message={message} />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area - Add z-index */}
      <div className="h-[80px] flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100 z-10 relative">
        <form onSubmit={handleSendMessage} className="relative flex items-center space-x-4">
          {/* Emoji Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BsEmojiSmile className="w-6 h-6" />
            </button>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  searchPlaceholder="Search emojis..."
                  width={320}
                  height={400}
                  previewConfig={{
                    showPreview: false
                  }}
                />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => {
                // Prevent multiple consecutive spaces
                const value = e.target.value.replace(/\s+/g, ' ');
                setMessageInput(value);
                if (socket && selectedUser) {
                  handleTyping();
                }
              }}
              onBlur={() => {
                if (socket && selectedUser && isTyping) {
                  socket.emit('typing', {
                    sender_id: loggedInUser.id,
                    receiver_id: selectedUser.id,
                    isTyping: false
                  });
                  setIsTyping(false);
                }
              }}
              placeholder={editingMessage ? "Edit message..." : "Type your message..."}
              className={`w-full pl-4 pr-12 py-3 rounded-xl border ${editingMessage
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
                } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all`}
              disabled={isLoading}
            />
            {editingMessage && (
              <button
                type="button"
                onClick={() => {
                  setEditingMessage(null);
                  setMessageInput('');
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !messageInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperPlane className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
