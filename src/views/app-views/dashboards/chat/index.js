import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ChatMenu from './ChatMenu'
import ChatContent from './ChatContent'
import socketService from 'services/SocketService';

const Chat = () => {
	const dispatch = useDispatch();
	const [selectedUser, setSelectedUser] = useState(null);
	const [groupChats, setGroupChats] = useState([]);
	const allUsers = useSelector((state) => state.Users.Users?.data || []);
	const loggedInUser = useSelector((state) => state.user.loggedInUser);

	useEffect(() => {
		const socket = socketService.connect();

		// Get group chats data
		socket.emit('get_group_chats', { userId: loggedInUser.id });

		// Listen for group chats data
		socket.emit('group_chats_received', (groups) => {
			setGroupChats(groups);

			// If there was a selected group chat, restore it
			const savedChatId = localStorage.getItem('selectedChatUser');
			if (savedChatId) {
				const savedGroup = groups.find(g => g.id.toString() === savedChatId);
				if (savedGroup) {
					setSelectedUser({ ...savedGroup, isGroup: true });
				}
			}
		});

		// Listen for group updates
		socket.on('group_chat_updated', (updatedGroup) => {
			setGroupChats(prev =>
				prev.map(group =>
					group.id === updatedGroup.id ? { ...updatedGroup, isGroup: true } : group
				)
			);

			// Update selected user if it's the current group
			if (selectedUser?.id === updatedGroup.id) {
				setSelectedUser({ ...updatedGroup, isGroup: true });
			}
		});

		return () => {
			socket.off('group_chats_received');
			socket.off('group_chat_updated');
		};
	}, [loggedInUser.id]);

	// Handle user/group selection
	const handleSelectUser = (userOrGroup) => {
		const isGroup = userOrGroup.isGroup;
		const updatedSelection = isGroup
			? { ...userOrGroup, messages: groupChats.find(g => g.id === userOrGroup.id)?.messages || [] }
			: userOrGroup;

		setSelectedUser(updatedSelection);
		localStorage.setItem('selectedChatUser', userOrGroup.id.toString());
	};

	return (
		<div className="flex h-[calc(100vh-180px)]">
			{/* Sidebar - Add z-index */}
			<div className="w-[380px] flex-shrink-0 border-r border-gray-200 bg-white z-20 relative">
				<ChatMenu
					onSelectUser={handleSelectUser}
					selectedUserId={selectedUser?.id}
					groupChats={groupChats}
				/>
			</div>

			{/* Main chat area - Add z-index */}
			<div className="flex-1 bg-white">
				{selectedUser ? (
					<ChatContent
						selectedUser={selectedUser}
						onGroupUpdate={(updatedGroup) => {
							setGroupChats(prev =>
								prev.map(group =>
									group.id === updatedGroup.id ? { ...updatedGroup, isGroup: true } : group
								)
							);
						}}
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gray-50">
						<div className="text-xl text-gray-500">
							Select a user to start chatting
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Chat;
