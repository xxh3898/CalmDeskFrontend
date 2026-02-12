import React, { useEffect } from 'react';
import useStore from '../../../store/useStore';
import { RoomListStart, RoomItem } from './Chat.styles';
import axios from '../../../api/axios';

const ChatRoomList = ({ isDark }) => {
    const {
        chatRooms,
        currentRoomId,
        setChatRooms,
        setCurrentRoomId
    } = useStore(state => state.chat);

    const { user } = useStore();

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                console.log('Fetching chat rooms...');
                const response = await axios.get('/chat/rooms');
                console.log('Chat rooms fetched:', response.data);
                setChatRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, [setChatRooms]);

    const handleRoomClick = (roomId) => {
        setCurrentRoomId(roomId);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getRoomName = (roomName) => {
        if (!roomName || !user?.name) return roomName;
        const names = roomName.split(',').map(n => n.trim());
        const filteredNames = names.filter(n => n !== user.name);
        return filteredNames.length > 0 ? filteredNames.join(', ') : roomName;
    };

    return (
        <>
            <RoomListStart $isDark={isDark}>
                <h2>메시지</h2>
            </RoomListStart>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {chatRooms.map(room => (
                    <RoomItem
                        key={room.id}
                        $active={currentRoomId === room.roomId}
                        $isDark={isDark}
                        onClick={() => handleRoomClick(room.roomId)}
                    >
                        <div className="room-name">{getRoomName(room.name)}</div>
                        <div className="last-message">{room.lastMessageContent}</div>
                        <div className="time">{formatTime(room.lastMessageTime)}</div>
                    </RoomItem>
                ))}
            </div>
        </>
    );
};

export default ChatRoomList;
