import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaUser, FaPaperPlane, FaFile, FaImage, FaVideo, FaPaperclip } from "react-icons/fa";
import { BsCheck, BsCheckAll, BsEmojiSmile, BsThreeDotsVertical, BsPencil, BsTrash, BsClipboard, BsX } from "react-icons/bs";
import socketService from 'services/SocketService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmojiPicker from 'emoji-picker-react';
import { UPLOAD_CONFIG } from 'config/upload.config';
import { Toaster } from 'react-hot-toast';

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

// Update the FilePreview component to receive uploadProgress as a prop
const FilePreview = ({ file, onRemove, uploadProgress = {} }) => {
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FaImage className="w-5 h-5" />;
    if (type.startsWith('video/')) return <FaVideo className="w-5 h-5 text-green-500" />;
    return <FaFile className="w-5 h-5" />;
  };

  const getFileSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const progress = uploadProgress[file.name] || 0;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      {getFileIcon(file.type)}
      <div className="flex-1">
        <span className="text-sm truncate max-w-[150px] block">{file.name}</span>
        <span className="text-xs text-gray-500">{getFileSize(file.size)}</span>
        {progress > 0 && progress < 100 && (
          <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(file)}
        className="p-1 hover:bg-gray-200 rounded-full"
        disabled={progress > 0 && progress < 100}
      >
        <BsX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Add FileTypeSelector component
const FileTypeSelector = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-48">
      <button
        onClick={() => onSelect('image')}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
      >
        <FaImage className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-gray-700">Images</span>
      </button>
      <button
        onClick={() => onSelect('video')}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
      >
        <FaVideo className="w-4 h-4 text-green-500" />
        <span className="text-sm text-gray-700">Videos</span>
      </button>
      <button
        onClick={() => onSelect('document')}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
      >
        <FaFile className="w-4 h-4 text-orange-500" />
        <span className="text-sm text-gray-700">Documents</span>
      </button>
    </div>
  );
};

// Update the FileContextMenu component
const FileContextMenu = ({ x, y, onDownload, onDelete, isOwnMessage, file }) => {
  const menuRef = useRef(null);

  // Add effect to handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onDelete(null); // This will close the menu
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDelete]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg py-1 z-[60] border border-gray-200"
      style={{ top: y, left: x }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDownload(file);
        }}
        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download</span>
      </button>
      {isOwnMessage && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(file);
          }}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <BsTrash className="w-4 h-4" />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
};

// Keep downloadFile as a standalone utility function
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

// Add ImagePreviewModal component at the top of the file
const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 text-white hover:text-gray-300 z-[71]"
        >
          <BsX className="w-6 h-6" />
        </button>

        {/* Image */}
        <img
          src={image.url}
          alt={image.name}
          className="max-w-full max-h-[90vh] object-contain"
        />

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
          <p className="text-sm truncate">{image.name}</p>
        </div>
      </div>
    </div>
  );
};

// Add this helper function to get file type summary
const getFileTypeSummary = (attachments) => {
  if (!attachments || attachments.length === 0) return '';

  const fileTypes = attachments.reduce((acc, file) => {
    if (file.type.startsWith('image/')) acc.images++;
    else if (file.type.startsWith('video/')) acc.videos++;
    else acc.documents++;
    return acc;
  }, { images: 0, videos: 0, documents: 0 });

  const summary = [];
  if (fileTypes.images) summary.push(`${fileTypes.images} ${fileTypes.images === 1 ? 'image' : 'images'}`);
  if (fileTypes.videos) summary.push(`${fileTypes.videos} ${fileTypes.videos === 1 ? 'video' : 'videos'}`);
  if (fileTypes.documents) summary.push(`${fileTypes.documents} ${fileTypes.documents === 1 ? 'document' : 'documents'}`);

  return summary.join(', ');
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showFileSelector, setShowFileSelector] = useState(false);
  const fileSelectorRef = useRef(null);

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

    // Listen for typing status only from the other user
    newSocket.on('user_typing', ({ userId, isTyping: typing }) => {
      if (userId === selectedUser.id) { // Only show typing for the selected user
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
    newSocket.on('receive_message', ({ user_id, message }) => {
      if (user_id === selectedUser.id || message.sender_id === selectedUser.id) {
        setMessages(prev => {
          const messageExists = prev.some(m =>
            m.timestamp === message.timestamp &&
            m.sender_id === message.sender_id
          );
          if (messageExists) {
            return prev;
          }
          return [...prev, message];
        });

        // Clear selected files and progress after successful upload
        setSelectedFiles([]);
        setUploadProgress({});
      }
    });

    // Listen for message status updates
    newSocket.on('message_status_updated', ({ message_timestamp, status, sender_id }) => {
      setMessages(prev => prev.map(msg => {
        // Only update status for messages from the logged-in user
        if (msg.timestamp === message_timestamp && msg.sender_id === loggedInUser.id) {
          return { ...msg, status };
        }
        return msg;
      }));
    });

    // Listen for deleted messages
    newSocket.on('message_deleted', ({ message_timestamp, conversations }) => {
      if (conversations[selectedUser.id]) {
        setMessages(conversations[selectedUser.id]);
      } else {
        setMessages(prev => prev.filter(msg => msg.timestamp !== message_timestamp));
      }
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

    // Mark messages as read when opening chat
    if (selectedUser.id) {
      newSocket.emit('mark_messages_read', {
        sender_id: selectedUser.id,
        receiver_id: loggedInUser.id,
        timestamp: new Date().toISOString()
      });
    }

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

  // Update the file input and its handler
  const handleFileTypeSelect = (type) => {
    const acceptTypes = {
      image: UPLOAD_CONFIG.ALLOWED_FILE_TYPES.IMAGE.join(','),
      video: UPLOAD_CONFIG.ALLOWED_FILE_TYPES.VIDEO.join(','),
      document: UPLOAD_CONFIG.ALLOWED_FILE_TYPES.DOCUMENT.join(',')
    };

    // Set file size limit based on type
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 25 * 1024 * 1024; // 100MB for videos, 25MB for others

    fileInputRef.current.accept = acceptTypes[type];
    // Store current file type for validation
    fileInputRef.current.dataset.fileType = type;
    fileInputRef.current.click();
    setShowFileSelector(false);
  };

  // Update handleFileSelect to handle large files
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const fileType = e.target.dataset.fileType;

    if (files.length > 0) {
      // Validate file types and sizes
      const invalidFiles = files.filter(file => {
        const acceptedTypes = UPLOAD_CONFIG.ALLOWED_FILE_TYPES[fileType.toUpperCase()];
        const maxSize = fileType === 'video' ? 100 * 1024 * 1024 : 25 * 1024 * 1024;

        if (!acceptedTypes.includes(file.type)) {
          console.error(`Invalid file type: ${file.type}`);
          return true;
        }

        if (file.size > maxSize) {
          console.error(`File too large: ${file.name}`);
          return true;
        }

        return false;
      });

      if (invalidFiles.length > 0) {
        console.error('Invalid files detected');
        // Optionally show error to user
        return;
      }

      setSelectedFiles(prev => [...prev, ...files]);
      e.target.value = null;
    }
  };

  // Update handleSendMessage to handle large files
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && selectedFiles.length === 0) || isLoading) return;

    setIsLoading(true);

    try {
      if (editingMessage) {
        // Handle message editing
        socket.emit('edit_message', {
          sender_id: loggedInUser.id,
          receiver_id: selectedUser.id,
          message_timestamp: editingMessage.timestamp,
          new_message: messageInput
        });
        setEditingMessage(null);
      } else {
        if (selectedFiles.length > 0) {
          // Add file type summary to message
          const fileSummary = getFileTypeSummary(selectedFiles);
          const messageText = messageInput.trim()
            ? `${messageInput}\n${fileSummary}`
            : fileSummary;

          // Process files in chunks if needed
          const processedFiles = await Promise.all(selectedFiles.map(async file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  data: reader.result,
                  isVideo: file.type.startsWith('video/')
                });
              };
              reader.readAsDataURL(file);
            });
          }));

          // Send files through socket service
          await socketService.sendFiles({
            files: processedFiles,
            sender_id: loggedInUser.id,
            receiver_id: selectedUser.id,
            message: messageText
          });

          // Clear files and reset progress
          setSelectedFiles([]);
          setUploadProgress({});
        } else {
          // Handle text message
          socket.emit('send_message', {
            sender_id: loggedInUser.id,
            receiver_id: selectedUser.id,
            message: messageInput,
            timestamp: new Date().toISOString()
          });
        }
      }

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageInput('');
  };

  const handleTyping = () => {
    if (!socket) return;

    // Only emit if we weren't already typing
    if (!isTyping) {
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

  // Update the MessageContextMenu component
  const MessageContextMenu = ({ onEdit, onDelete, onCopy, isOwnMessage }) => {
    return (
      <div className="absolute -top-10 right-0 flex items-center gap-2 bg-white rounded-full shadow-lg py-1.5 px-2 border border-gray-200 z-[9999]">
        <button
          onClick={onCopy}
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Copy"
        >
          <BsClipboard className="w-4 h-4" />
        </button>
        {isOwnMessage && (
          <>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit"
            >
              <BsPencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-red-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Unsend"
            >
              <BsTrash className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Update the MessageItem component
  const MessageItem = ({ message, socket, loggedInUser, selectedUser }) => {
    const isOwnMessage = message.sender_id === loggedInUser.id;
    const [showOptions, setShowOptions] = useState(false);
    const [activeFileMenu, setActiveFileMenu] = useState(null);

    // Add ref for context menu
    const contextMenuRef = useRef(null);

    // Update handleContextMenu
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Close any other open context menus first
      document.dispatchEvent(new CustomEvent('closeContextMenus'));
      if (isOwnMessage) {
        setShowOptions(true);
      }
    };

    // Add event listener for closing context menus
    useEffect(() => {
      const closeMenus = () => {
        setShowOptions(false);
        setActiveFileMenu(null);
      };

      document.addEventListener('closeContextMenus', closeMenus);
      return () => document.removeEventListener('closeContextMenus', closeMenus);
    }, []);

    // Update handleFileContextMenu
    const handleFileContextMenu = (e, file) => {
      e.preventDefault();
      e.stopPropagation();
      // Close any other open context menus first
      document.dispatchEvent(new CustomEvent('closeContextMenus'));
      setActiveFileMenu({
        file,
        x: e.pageX,
        y: e.pageY
      });
    };

    // Add click outside handler
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
          setShowOptions(false);
          setActiveFileMenu(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = () => {
      setEditingMessage(message);
      setMessageInput(message.message);
      setShowOptions(false);
    };

    const handleDelete = () => {
      // Emit delete event directly without showing modal
      if (socket) {
        socket.emit('delete_message', {
          sender_id: loggedInUser.id,
          receiver_id: selectedUser.id,
          message_timestamp: message.timestamp
        });
      }
      setShowOptions(false);
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(message.message);
      setShowOptions(false);
    };

    const handleDownload = async (file) => {
      await downloadFile(file.url, file.name);
      setActiveFileMenu(null);
    };

    const handleFileDelete = async (file) => {
      try {
        if (!socket) return;

        const deletePromise = new Promise((resolve, reject) => {
          const successHandler = () => {
            socket.off('delete_success', successHandler);
            socket.off('delete_error', errorHandler);
            resolve();
          };

          const errorHandler = (error) => {
            socket.off('delete_success', successHandler);
            socket.off('delete_error', errorHandler);
            reject(new Error(error.message));
          };

          socket.once('delete_success', successHandler);
          socket.once('delete_error', errorHandler);

          socket.emit('delete_message_with_files', {
            message_timestamp: message.timestamp,
            sender_id: loggedInUser.id,
            receiver_id: selectedUser.id,
            files: [file]
          });
        });

        await deletePromise;
        setActiveFileMenu(null);

      } catch (error) {
        console.error('Error deleting file:', error);
        setActiveFileMenu(null);
      }
    };

    const getFileIcon = (type) => {
      if (type.startsWith('image/')) return <FaImage className="w-6 h-6 text-blue-500" />;
      if (type.startsWith('video/')) return <FaVideo className="w-6 h-6 text-green-500" />;
      if (type.startsWith('application/pdf')) return <FaFile className="w-6 h-6 text-red-500" />;
      if (type.includes('document') || type.includes('msword')) return <FaFile className="w-6 h-6 text-blue-600" />;
      if (type.includes('sheet') || type.includes('excel')) return <FaFile className="w-6 h-6 text-green-600" />;
      return <FaFile className="w-6 h-6 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const [previewImage, setPreviewImage] = useState(null);

    const renderAttachments = (attachments) => {
      if (!attachments) return null;

      return (
        <div className="space-y-3 mt-2">
          {attachments.map((file, index) => {
            if (file.type.startsWith('image/')) {
              return (
                <div
                  key={index}
                  className="group relative"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFileContextMenu(e, file);
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-[300px] max-h-[300px] rounded-lg object-cover cursor-pointer hover:opacity-95"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage(file);  // Open preview modal
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{file.name}</span>
                      <span className="ml-2 text-xs">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              );
            }
            if (file.type.startsWith('video/')) {
              return (
                <div
                  key={index}
                  className="max-w-[400px]"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFileContextMenu(e, file);
                  }}
                >
                  <video
                    controls
                    className="w-full rounded-lg"
                    poster={file.thumbnail}
                  >
                    <source src={file.url} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                  <div className="mt-1 text-sm text-gray-500 flex items-center justify-between px-1">
                    <span className="truncate">{file.name}</span>
                    <span className="ml-2">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={index}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFileContextMenu(e, file);
                }}
              >
                <a
                  href={file.url}
                  download={file.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!activeFileMenu) {
                      downloadFile(file.url, file.name);
                    }
                  }}
                  className="block max-w-[400px] p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {file.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span className="uppercase">{file.type.split('/')[1]}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}

          {/* Image Preview Modal */}
          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />

          {/* File Context Menu */}
          {activeFileMenu && (
            <div className="file-context-menu">
              <FileContextMenu
                x={activeFileMenu.x}
                y={activeFileMenu.y}
                onDownload={() => handleDownload(activeFileMenu.file)}
                onDelete={() => handleFileDelete(activeFileMenu.file)}
                isOwnMessage={message.sender_id === loggedInUser.id}
                file={activeFileMenu.file}
              />
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
        onContextMenu={handleContextMenu}
        ref={contextMenuRef}
      >
        <div className="relative max-w-[70%] group message-options">
          {/* Context Menu */}
          {showOptions && (
            <MessageContextMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              isOwnMessage={isOwnMessage}
            />
          )}

          {/* Message content */}
          <div className={`px-4 py-2.5 shadow-sm ${isOwnMessage
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl rounded-l-2xl'
            : 'bg-white text-gray-800 rounded-t-2xl rounded-r-2xl'
            }`}>
            {message.message && (
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                {message.message}
              </p>
            )}
            {/* Add file type summary before attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className={`text-sm ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} mt-1 mb-2`}>
                <div className="flex items-center gap-1">
                  <FaPaperclip className="w-3 h-3" />
                  <span>{getFileTypeSummary(message.attachments)}</span>
                </div>
              </div>
            )}
            {renderAttachments(message.attachments)}
          </div>

          {/* Message status and time */}
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

  // Add effect to listen for upload progress
  useEffect(() => {
    if (!socket) return;

    socket.on('upload_progress', ({ fileId, progress }) => {
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    });

    return () => {
      socket.off('upload_progress');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('upload_error', ({ message }) => {
      console.error('Upload error:', message);
      // Optionally show error to user
      // toast.error(message);
      setIsLoading(false);
    });

    return () => {
      socket.off('upload_error');
    };
  }, [socket]);

  // Add click outside handler for file selector
  useEffect(() => {
    function handleClickOutside(event) {
      if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
        setShowFileSelector(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
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
                <MessageItem
                  key={message.timestamp}
                  message={message}
                  socket={socket}
                  loggedInUser={loggedInUser}
                  selectedUser={selectedUser}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area - Add z-index */}
      <div className="h-auto flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100 z-10">
        {/* File Preview Area */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => setSelectedFiles(prev => prev.filter(f => f !== file))}
                uploadProgress={uploadProgress}
              />
            ))}
          </div>
        )}

        {editingMessage && (
          <div className="absolute top-0 left-0 right-0 transform -translate-y-full bg-blue-50 px-6 py-2 flex justify-between items-center border-t border-blue-100">
            <span className="text-sm text-blue-600">Editing message</span>
            <button
              onClick={handleCancelEdit}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative flex items-center space-x-4">
          {/* Attachment Button with Selector */}
          <div className="relative" ref={fileSelectorRef}>
            <button
              type="button"
              onClick={() => setShowFileSelector(!showFileSelector)}
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaPaperclip className="w-5 h-5" />
            </button>

            {/* File Type Selector */}
            {showFileSelector && (
              <FileTypeSelector onSelect={handleFileTypeSelect} />
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
          </div>

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
                setMessageInput(e.target.value);
                handleTyping();
              }}
              placeholder={editingMessage ? "Edit message..." : "Type a message..."}
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isLoading || (messageInput.trim().length === 0 && selectedFiles.length === 0)}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaPaperPlane className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
