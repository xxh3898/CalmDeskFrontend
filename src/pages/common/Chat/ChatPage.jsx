import React from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import { ChatContainer, Sidebar, ChatArea, EmptyState } from './Chat.styles';
import useStore from '../../../store/useStore';

const ChatPage = () => {
    const { currentRoomId } = useStore(state => state.chat);

    return (
        <ChatContainer>
            <Sidebar>
                <ChatRoomList />
            </Sidebar>
            <ChatArea>
                {currentRoomId ? (
                    <ChatRoom />
                ) : (
                    <EmptyState>
                        채팅방을 선택하거나 새로운 대화를 시작해보세요.
                    </EmptyState>
                )}
            </ChatArea>
        </ChatContainer>
    );
};

export default ChatPage;
