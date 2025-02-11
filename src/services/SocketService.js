import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        try {
            if (!this.socket) {
                // Use the same port as your backend server
                const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5353';

                this.socket = io(SOCKET_URL, {
                    withCredentials: true,
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000
                });

                // Add connection event handlers
                this.socket.on('connect', () => {
                    console.log('Connected to socket server');
                });

                this.socket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                });

                this.socket.on('disconnect', () => {
                    console.log('Disconnected from socket server');
                });

                this.socket.on('error', (error) => {
                    console.error('Socket error:', error);
                    // You might want to show this error to the user
                    if (error.details) {
                        console.error('Error details:', error.details);
                    }
                });
            }
            return this.socket;
        } catch (error) {
            console.error('Error connecting to socket:', error);
            return null;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinRoom(userId) {
        if (this.socket) {
            this.socket.emit('join_room', userId);
        }
    }

    sendMessage(data) {
        if (this.socket) {
            try {
                const messageData = {
                    ...data,
                    message: String(data.message).trim(),
                    timestamp: new Date().toISOString()
                };

                this.socket.emit('send_message', messageData);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('Socket not connected');
        }
    }

    getConversations(userId) {
        if (this.socket) {
            this.socket.emit('get_conversations', { userId });
        }
    }

    updateMessageStatus(data) {
        if (this.socket) {
            this.socket.emit('update_message_status', data);
        }
    }

    deleteMessage(data) {
        if (this.socket) {
            this.socket.emit('delete_message', data);
        }
    }

    // Notification methods
    sendNotification(notification) {
        if (this.socket) {
            this.socket.emit('send_notification', notification);
        }
    }

    onReceiveNotification(callback) {
        if (this.socket) {
            this.socket.on('receive_notification', callback);
        }
    }

    // Typing status methods
    sendTyping(data) {
        if (this.socket) {
            this.socket.emit('typing', data);
        }
    }

    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('user_typing', callback);
        }
    }

    saveGroupChat(groupData) {
        const savedGroups = JSON.parse(localStorage.getItem('groupChats') || '[]');
        const updatedGroups = savedGroups.map(group =>
            group.id === groupData.id ? groupData : group
        );

        if (!savedGroups.find(g => g.id === groupData.id)) {
            updatedGroups.push(groupData);
        }

        localStorage.setItem('groupChats', JSON.stringify(updatedGroups));
    }

    getStoredGroupChats() {
        return JSON.parse(localStorage.getItem('groupChats') || '[]');
    }

    // Add group-related socket methods
    createGroup(groupData) {
        if (this.socket) {
            this.socket.emit('create_group', groupData);
        }
    }

    joinGroup(groupId, userId) {
        if (this.socket) {
            this.socket.emit('join_group', { groupId, userId });
        }
    }

    leaveGroup(groupId, userId) {
        if (this.socket) {
            this.socket.emit('leave_group', { groupId, userId });
        }
    }

    sendGroupMessage(groupId, message) {
        if (this.socket) {
            this.socket.emit('group_message', { groupId, ...message });
        }
    }

    onGroupMessage(callback) {
        if (this.socket) {
            this.socket.on('group_message_received', callback);
        }
    }

    onGroupUpdate(callback) {
        if (this.socket) {
            this.socket.on('group_updated', callback);
        }
    }

    markMessagesAsRead(data) {
        if (this.socket) {
            this.socket.emit('mark_messages_read', data);
        }
    }

    sendFiles(data) {
        if (this.socket) {
            return new Promise((resolve, reject) => {
                this.socket.emit('upload_chat_files', data, (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                });
            });
        }
    }

    onUploadProgress(callback) {
        if (this.socket) {
            this.socket.on('upload_progress', callback);
        }
    }

    onUploadError(callback) {
        if (this.socket) {
            this.socket.on('upload_error', callback);
        }
    }
}

export default new SocketService(); 