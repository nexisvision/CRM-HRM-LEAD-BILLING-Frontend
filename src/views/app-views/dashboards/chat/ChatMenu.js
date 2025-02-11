import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser, FaSearch, FaTimes } from "react-icons/fa";
import { BsDot, BsPersonPlus, BsPeople, BsSearch, BsThreeDotsVertical, BsX } from "react-icons/bs";
import { GetUsers } from 'views/app-views/Users/UserReducers/UserSlice';
import { getRoles } from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';
import socketService from 'services/SocketService';
import dayjs from 'dayjs';

export default function ChatMenu({ onSelectUser, selectedUserId }) {
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState(new Set());
	const allUserData = useSelector((state) => state.Users);
	const users = allUserData.Users?.data || [];
	const loggedInUser = useSelector((state) => state.user.loggedInUser);
	const roles = useSelector((state) => state.role.role.data || []);
	const [usersStatus, setUsersStatus] = useState(new Map());
	const [unreadCounts, setUnreadCounts] = useState({});
	const [lastMessages, setLastMessages] = useState({});
	const [typingUsers, setTypingUsers] = useState(new Map());
	const [showCreateGroup, setShowCreateGroup] = useState(false);
	const [groups, setGroups] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState('');
	const [socket, setSocket] = useState(null);
	const [showOptions, setShowOptions] = useState(false);
	const optionsMenuRef = useRef(null);

	useEffect(() => {
		dispatch(GetUsers());
		dispatch(getRoles());

		const newSocket = socketService.connect();
		setSocket(newSocket);

		// Connect and emit user_connected
		newSocket.emit('user_connected', loggedInUser.id);

		// If there's a selected user, mark messages as read
		if (selectedUserId) {
			newSocket.emit('mark_messages_read', {
				sender_id: selectedUserId,
				receiver_id: loggedInUser.id
			});
		}

		newSocket.on('users_status', (data) => {
			const { activeUsers, userStatus } = data;
			setOnlineUsers(new Set(activeUsers));
			setUsersStatus(new Map(Object.entries(userStatus)));
		});

		// Get conversations to check unread messages and last message
		newSocket.emit('get_conversations', { userId: loggedInUser.id });

		newSocket.on('conversations_received', (data) => {
			// Handle both direct messages and groups
			const messages = {};
			const groupsList = [];

			Object.entries(data).forEach(([id, conv]) => {
				if (conv.type === 'group') {
					groupsList.push(conv);
				} else {
					messages[id] = {
						text: conv[conv.length - 1]?.message,
						timestamp: conv[conv.length - 1]?.timestamp,
						sender_id: conv[conv.length - 1]?.sender_id
					};
				}
			});

			setLastMessages(messages);
			setGroups(groupsList);
		});

		// Listen for new messages
		newSocket.on('receive_message', (data) => {
			const { user_id, message } = data;

			// Update last messages
			setLastMessages(prev => ({
				...prev,
				[user_id]: {
					text: message.message,
					timestamp: message.timestamp,
					sender_id: message.sender_id
				}
			}));

			// Update unread count if message is from other user and chat is not open
			if (message.sender_id !== loggedInUser.id && message.sender_id !== selectedUserId) {
				setUnreadCounts(prev => ({
					...prev,
					[message.sender_id]: (prev[message.sender_id] || 0) + 1
				}));
			}
		});

		// Listen for read status updates
		newSocket.on('message_status_updated', ({ user_id, status }) => {
			if (status === 'read') {
				setUnreadCounts(prev => ({
					...prev,
					[user_id]: 0
				}));
			}
		});

		// Listen for typing status
		const typingTimeouts = new Map();

		newSocket.on('user_typing', ({ userId, isTyping }) => {
			console.log('Typing event received:', { userId, isTyping }); // Debug log

			// Clear existing timeout
			if (typingTimeouts.has(userId)) {
				clearTimeout(typingTimeouts.get(userId));
				typingTimeouts.delete(userId);
			}

			if (isTyping) {
				setTypingUsers(prev => {
					const newMap = new Map(prev);
					newMap.set(userId, Date.now());
					return newMap;
				});

				// Set new timeout
				const timeout = setTimeout(() => {
					setTypingUsers(prev => {
						const newMap = new Map(prev);
						newMap.delete(userId);
						return newMap;
					});
				}, 3000);

				typingTimeouts.set(userId, timeout);
			} else {
				setTypingUsers(prev => {
					const newMap = new Map(prev);
					newMap.delete(userId);
					return newMap;
				});
			}
		});

		newSocket.on('groups_received', (groupsData) => {
			setGroups(groupsData);
		});

		newSocket.on('group_created', (newGroup) => {
			console.log('New group created:', newGroup);
			setGroups(prev => [...prev, newGroup]);
		});

		return () => {
			// Clear all timeouts
			typingTimeouts.forEach(timeout => clearTimeout(timeout));
			newSocket.off('users_status');
			newSocket.off('conversations_received');
			newSocket.off('receive_message');
			newSocket.off('message_status_updated');
			newSocket.off('user_typing');
			newSocket.off('groups_received');
			newSocket.off('group_created');
		};
	}, [dispatch, loggedInUser.id, selectedUserId]);

	// Add this effect to handle chat selection
	useEffect(() => {
		if (selectedUserId) {
			// Clear unread count when chat is opened
			setUnreadCounts(prev => ({
				...prev,
				[selectedUserId]: 0
			}));

			// Emit read status for the selected chat
			const newSocket = socketService.connect();
			newSocket.emit('mark_messages_read', {
				sender_id: selectedUserId,
				receiver_id: loggedInUser.id
			});
		}
	}, [selectedUserId, loggedInUser.id]);

	const isUserOnline = (userId) => {
		return usersStatus.get(userId)?.isOnline || false;
	};

	// Get role name from role_id
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

	const filteredUsers = users
		.filter(user => user.id !== loggedInUser.id)
		.filter(user => {
			const searchLower = searchTerm.toLowerCase();
			return (
				user.username?.toLowerCase().includes(searchLower) ||
				user.email?.toLowerCase().includes(searchLower) ||
				user.firstName?.toLowerCase().includes(searchLower) ||
				user.lastName?.toLowerCase().includes(searchLower)
			);
		});

	// Get count of online users excluding logged in user
	const getOnlineUsersCount = () => {
		return Array.from(usersStatus.values()).filter(status => status.isOnline).length - 1; // Exclude current user
	};

	// Format last message time
	const formatMessageTime = (timestamp) => {
		if (!timestamp) return '';

		const now = dayjs();
		const messageTime = dayjs(timestamp);

		if (now.isSame(messageTime, 'day')) {
			return messageTime.format('HH:mm');
		} else if (now.subtract(1, 'day').isSame(messageTime, 'day')) {
			return 'Yesterday';
		} else if (now.isSame(messageTime, 'week')) {
			return messageTime.format('ddd');
		} else {
			return messageTime.format('DD/MM/YY');
		}
	};

	// Update the getMessagePreview function
	const getMessagePreview = (userId, unreadCount) => {
		// Show typing status if user is typing
		if (typingUsers.has(userId)) {
			return (
				<div className="flex items-center">
					<span className="text-blue-500 font-medium flex items-center">
						Typing
						<span className="typing-animation ml-1">
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</span>
					</span>
				</div>
			);
		}

		const lastMessage = lastMessages[userId];
		if (!lastMessage) return <span className="text-gray-400 text-sm">No messages yet</span>;

		// If there are multiple unread messages and chat is not open
		if (unreadCount > 1 && userId !== selectedUserId) {
			return (
				<div className="flex items-center space-x-2">
					<span className="text-blue-500 font-medium">
						{unreadCount}+ new messages
					</span>
				</div>
			);
		}

		// For single message preview
		return (
			<div className="flex items-center space-x-1 truncate">
				{lastMessage.sender_id === loggedInUser.id && (
					<span className="text-xs text-gray-400 flex-shrink-0">You: </span>
				)}
				<span className="truncate">{lastMessage.text}</span>
			</div>
		);
	};

	// Add this sorting function
	const sortUsersByLastMessage = (users, lastMessages) => {
		return [...users].sort((a, b) => {
			const lastMessageA = lastMessages[a.id];
			const lastMessageB = lastMessages[b.id];

			// If no messages, put them at the bottom
			if (!lastMessageA && !lastMessageB) return 0;
			if (!lastMessageA) return 1;
			if (!lastMessageB) return -1;

			// Sort by timestamp in descending order (newest first)
			return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
		});
	};

	// Simplified CreateGroupModal component
	const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
		const [groupName, setGroupName] = useState('');
		const [selectedMembers, setSelectedMembers] = useState([]);

		const handleSubmit = (e) => {
			e.preventDefault();
			console.log('Submitting group:', { groupName, selectedMembers });

			if (groupName && selectedMembers.length > 0) {
				onCreateGroup({
					name: groupName,
					members: selectedMembers
				});
				// Reset form
				setGroupName('');
				setSelectedMembers([]);
				onClose();
			}
		};

		return (
			<div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
				<div className="absolute inset-0 bg-black/50" onClick={onClose} />
				<div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
					<h3 className="text-xl font-semibold mb-4">Create New Group</h3>

					<form onSubmit={handleSubmit}>
						{/* Group Name */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Group Name</label>
							<input
								type="text"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								className="w-full px-3 py-2 border rounded-lg"
								placeholder="Enter group name"
								required
							/>
						</div>

						{/* Member Selection */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Select Members</label>
							<div className="max-h-[200px] overflow-y-auto border rounded-lg">
								{users.filter(u => u.id !== loggedInUser.id).map(user => (
									<label key={user.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
										<input
											type="checkbox"
											checked={selectedMembers.includes(user.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedMembers(prev => [...prev, user.id]);
												} else {
													setSelectedMembers(prev =>
														prev.filter(id => id !== user.id)
													);
												}
											}}
											className="mr-3"
										/>
										<span>{user.firstName || user.username}</span>
									</label>
								))}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
								disabled={!groupName.trim() || selectedMembers.length === 0}
							>
								Create Group
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Simplified group creation handler
	const handleCreateGroup = (data) => {
		console.log('Creating group:', data);
		if (!socket) return;

		const groupData = {
			name: data.name,
			members: [...data.members, loggedInUser.id] // Add current user to members
		};

		socket.emit('create_group', groupData);
		setShowCreateGroup(false);
	};

	// Add Options Menu component
	const OptionsMenu = ({ onCreateGroup, onClose }) => {
		return (
			<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
				<div className="py-1">
					<button
						onClick={() => {
							onCreateGroup();
							onClose();
						}}
						className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
					>
						<BsPeople className="w-4 h-4" />
						<span>Create New Group</span>
					</button>
				</div>
			</div>
		);
	};

	// Add click outside handler
	useEffect(() => {
		function handleClickOutside(event) {
			if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="flex flex-col h-full">
			{/* Fixed Header - add flex-shrink-0 */}
			<div className="h-[72px] flex-shrink-0 px-6 flex items-center justify-between border-b border-gray-200">
				<div className="flex items-center space-x-4">
					<div className="flex flex-col">
						<h2 className="text-2xl font-bold text-gray-900">
							Messages
						</h2>
						<div className="flex items-center mt-1 space-x-2">
							<span className="w-2 h-2 rounded-full bg-green-500"></span>
							<span className="text-sm text-gray-500">
								{getOnlineUsersCount()} active now
							</span>
						</div>
					</div>
				</div>

				{/* Search Toggle Button */}
				<div className="flex items-center space-x-2">
					<button
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
					>
						{isSearchOpen ? (
							<BsX className="w-5 h-5" />
						) : (
							<BsSearch className="w-5 h-5" />
						)}
					</button>

					{/* Three dots menu */}
					<div className="relative" ref={optionsMenuRef}>
						<button
							onClick={() => setShowOptions(!showOptions)}
							className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
						>
							<BsThreeDotsVertical className="w-5 h-5" />
						</button>

						{/* Options Menu */}
						{showOptions && (
							<OptionsMenu
								onCreateGroup={() => setShowCreateGroup(true)}
								onClose={() => setShowOptions(false)}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Search Bar - add flex-shrink-0 */}
			{isSearchOpen && (
				<div className="flex-shrink-0 px-6 py-3 border-b border-gray-200">
					<div className="relative">
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
							autoFocus
						/>
					</div>
				</div>
			)}

			{/* Create Group Modal */}
			<CreateGroupModal
				isOpen={showCreateGroup}
				onClose={() => setShowCreateGroup(false)}
				onCreateGroup={handleCreateGroup}
			/>

			{/* Users List */}
			<div className="flex-1 overflow-y-auto custom-scrollbar">
				{filteredUsers.length === 0 && groups.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						No conversations found
					</div>
				) : (
					<div className="divide-y divide-gray-100">
						{/* Groups Section */}
						{groups.length > 0 && (
							<div>
								<div className="px-6 py-2 text-xs font-medium text-gray-500 uppercase bg-gray-50">
									Groups
								</div>
								{groups.map((group) => (
									<button
										key={group.id}
										onClick={() => onSelectUser({ ...group, isGroup: true })}
										className={`w-full px-6 py-3 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${selectedUserId === group.id ? 'bg-blue-50' : ''
											}`}
									>
										{/* Group Avatar */}
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
												<span className="text-white text-lg font-medium">
													{group.name.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>

										{/* Group Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<h3 className="text-sm font-medium text-gray-900 truncate">
													{group.name}
												</h3>
												{lastMessages[group.id] && (
													<span className="text-xs text-gray-500">
														{formatMessageTime(lastMessages[group.id].timestamp)}
													</span>
												)}
											</div>
											<div className="flex items-center justify-between mt-1">
												<p className="text-sm text-gray-500 truncate">
													{group.members.length} members
												</p>
												{unreadCounts[group.id] > 0 && (
													<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
														{unreadCounts[group.id]}
													</span>
												)}
											</div>
										</div>
									</button>
								))}
							</div>
						)}

						{/* Users Section */}
						<div>
							<div className="px-6 py-2 text-xs font-medium text-gray-500 uppercase bg-gray-50">
								Direct Messages
							</div>
							{sortUsersByLastMessage(filteredUsers, lastMessages).map((user) => (
								<button
									key={user.id}
									onClick={() => onSelectUser(user)}
									className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors focus:outline-none group"
								>
									{/* User Avatar */}
									<div className="relative flex-shrink-0">
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
										{/* Online Status Indicator */}
										<span
											className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
												${usersStatus.get(user.id)?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
										/>
									</div>

									{/* User Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1">
											<div className="flex items-center space-x-2">
												<h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
													{user.firstName
														? `${user.firstName} ${user.lastName || ''}`
														: user.username}
												</h3>
												<span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role_id)}`}>
													{getRoleName(user.role_id)}
												</span>
											</div>
											{/* Last message time */}
											{lastMessages[user.id] && (
												<span className="text-xs text-gray-500">
													{formatMessageTime(lastMessages[user.id].timestamp)}
												</span>
											)}
										</div>
										<div className="flex items-center justify-between">
											{/* Message preview */}
											<div className="flex items-center space-x-2 text-sm text-gray-500 truncate max-w-[70%]">
												{getMessagePreview(user.id, unreadCounts[user.id] || 0)}
											</div>
											{/* Unread count badge - only show if chat is not open */}
											{user.id !== selectedUserId && (
												<>
													{unreadCounts[user.id] === 1 && (
														<span className="min-w-[20px] h-5 flex items-center justify-center text-xs font-medium text-white bg-blue-500 rounded-full">
															1
														</span>
													)}
													{unreadCounts[user.id] > 1 && (
														<span className="min-w-[20px] h-5 flex items-center justify-center text-xs font-medium text-white bg-blue-500 rounded-full px-1.5">
															{unreadCounts[user.id]}+
														</span>
													)}
												</>
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
