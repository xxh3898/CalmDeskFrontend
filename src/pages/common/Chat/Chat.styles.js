import styled from 'styled-components';

export const ChatContainer = styled.div`
    display: flex;
    height: calc(100vh - 80px); /* 헤더 높이 제외 */
    background-color: #f4f6f8;
`;

export const Sidebar = styled.div`
    width: 320px;
    background-color: white;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
`;

export const ChatArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
`;

export const RoomListStart = styled.div`
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #333;
    }
`;

export const RoomItem = styled.div`
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    background-color: ${(props) => (props.$active ? '#e6f7ff' : 'transparent')};
    &:hover {
        background-color: #f0f0f0;
    }

    .room-name {
        font-weight: 600;
        margin-bottom: 5px;
        color: #333;
    }

    .last-message {
        font-size: 0.9rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .time {
        font-size: 0.8rem;
        color: #999;
        margin-top: 5px;
        text-align: right;
    }
`;

export const MessageList = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
`;

export const MessageBubble = styled.div`
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 20px;
    background-color: ${(props) => (props.$isMe ? '#dcf8c6' : '#ffffff')};
    align-self: ${(props) => (props.$isMe ? 'flex-end' : 'flex-start')};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    word-break: break-word;

    .sender {
        font-size: 0.75rem;
        margin-bottom: 4px;
        color: ${(props) => (props.$isMe ? '#e3f2fd' : '#888')};
    }
    
    .time {
        font-size: 0.7rem;
        margin-top: 5px;
        text-align: right;
        color: ${(props) => (props.$isMe ? '#e3f2fd' : '#aaa')};
    }
`;

export const InputArea = styled.form`
    padding: 20px;
    background-color: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;

    input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        outline: none;
        font-size: 1rem;

        &:focus {
            border-color: #2196f3;
        }
    }

    button {
        padding: 0 24px;
        background-color: #2196f3;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #1976d2;
        }
        
        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }
`;

export const EmptyState = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 1.1rem;
`;
