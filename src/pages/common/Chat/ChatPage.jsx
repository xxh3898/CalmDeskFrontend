import React from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import { ChatContainer, Sidebar, ChatArea, EmptyState } from './Chat.styles';
import useStore from '../../../store/useStore';

const ChatPage = () => {
    const { currentRoomId } = useStore(state => state.chat);
    const isAdminMode = useStore(state => state.isAdminMode);

    return (
        <ChatContainer $isDark={isAdminMode}>
            <Sidebar $isDark={isAdminMode}>
                <ChatRoomList isDark={isAdminMode} />
            </Sidebar>
            <ChatArea $isDark={isAdminMode}>
                {currentRoomId ? (
                    <ChatRoom isDark={isAdminMode} />
                ) : (
                    <EmptyState $isDark={isAdminMode}>
                        채팅방을 선택하거나 새로운 대화를 시작해보세요.
                    </EmptyState>
                )}
            </ChatArea>
        </ChatContainer>
    );
};

export default ChatPage;
