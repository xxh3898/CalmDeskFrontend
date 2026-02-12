export const createChatSlice = (set, get) => ({
    chat: {
        chatRooms: [],
        currentRoomId: null,
        messages: [],
        isConnected: false,
        stompClient: null,

        // Actions
        setChatRooms: (rooms) => set((state) => ({
            chat: { ...state.chat, chatRooms: rooms }
        })),
        setCurrentRoomId: (roomId) => set((state) => ({
            chat: { ...state.chat, currentRoomId: roomId }
        })),
        setMessages: (messages) => set((state) => ({
            chat: { ...state.chat, messages: messages }
        })),
        addMessage: (message) => set((state) => ({
            chat: { ...state.chat, messages: [...state.chat.messages, message] }
        })),
        setIsConnected: (status) => set((state) => ({
            chat: { ...state.chat, isConnected: status }
        })),
        setStompClient: (client) => set((state) => ({
            chat: { ...state.chat, stompClient: client }
        })),
    }
});
