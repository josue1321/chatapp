import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { Chat, SelectedChat } from "../models/Chat";
import { CreateDmChatApi, GetSearchedUserChatApi, GetUserChatsApi, UpdateChatLastMessageTimeApi } from "../services/ChatService";
import { MessageModel } from "../models/Message";

type ChatState = {
    socket: HubConnection | null
    selectedChat: SelectedChat | null,
    chats: Array<Chat>
    isChatsLoading: boolean
    isFetchingMessages: boolean
    connectSocket: () => Promise<void>
    disconnect: () => void
    sendMessage: (message: MessageModel) => void,
    getChats: () => void
    setSelectedChat: (chat: SelectedChat | null) => Promise<void>
    getChatOlderMessages: (chat: SelectedChat | null) => void
    createDmChat: (receiverUserName: string) => Promise<number>
}

export const useChatStore = create<ChatState>((set, get) => ({
    socket: null,
    selectedChat: null,
    chats: [],
    isChatsLoading: false,
    isFetchingMessages: false,

    connectSocket: async () => {
        const { socket } = get()

        if (socket && (socket.state == "Connected" || socket.state == "Connecting")) return

        const hubConnection = new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_CHAT_API + "/chat", {
                accessTokenFactory: () => useAuthStore.getState().token,
                withCredentials: true,
            })
            .configureLogging(LogLevel.Warning)
            .withAutomaticReconnect()
            .build();

        try {
            await hubConnection.start();
            console.log(hubConnection.connectionId)

            hubConnection.on("ReceiveMessage", async (message: MessageModel, newMessageIndex: number) => {
                const { user } = useAuthStore.getState()

                set((state) => {
                    const updatedChats = state.chats.map(chat => chat.chatId == message.chatId
                        ? {
                            ...chat,
                            lastMessage: message.content,
                            lastMessageSenderId: message.senderId,
                            lastMessageStatus: message.status,
                            updatedAt: message.sentAt.toString(),
                            unreadMessages: message.senderId != user?.id && state.selectedChat?.chatId != message.chatId ? chat.unreadMessages!++ : chat.unreadMessages
                        }
                        : chat
                    )

                    updatedChats.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

                    if (!state.selectedChat || state.selectedChat.chatId != message.chatId) {
                        return { chats: updatedChats }
                    }

                    if (!state.selectedChat.messages) return state

                    const updatedMessages = [...state.selectedChat.messages]
                    updatedMessages[newMessageIndex] = message

                    return { selectedChat: { ...state.selectedChat, messages: updatedMessages }, chats: updatedChats }
                })

                if (message.senderId != user?.id && get().selectedChat?.chatId == message.chatId) {
                    await get().socket?.invoke("SetChatMessageRead", message.id, message.chatId)
                }
            });


            hubConnection.on("UpdateReadMessages", (chatId: number, receiverId: string) => {
                const { user } = useAuthStore.getState()
                const READ_STATUS: MessageModel["status"] = "Read"

                set((state) => {
                    const updatedChats = state.chats.map(chat => {
                        if (chat.chatId !== chatId) return chat

                        return user?.id === receiverId
                            ? { ...chat, unreadMessages: 0 }
                            : { ...chat, lastMessageStatus: READ_STATUS }
                    })

                    if (!state.selectedChat || state.selectedChat.chatId !== chatId) {
                        return { chats: updatedChats }
                    }

                    const updatedMessages = state.selectedChat.messages?.map(msg => msg.senderId != receiverId && msg.status != READ_STATUS
                        ? { ...msg, status: READ_STATUS }
                        : msg
                    )

                    return { selectedChat: { ...state.selectedChat, messages: updatedMessages }, chats: updatedChats }
                })
            })

            hubConnection.on("ErrorSendingMessage", (message: MessageModel, newMessageIndex: number) => {
                set((state) => {
                    const updatedChats = state.chats.map(chat => chat.chatId == message.chatId
                        ? {
                            ...chat,
                            lastMessage: message.content,
                            lastMessageSenderId: message.senderId,
                            lastMessageStatus: message.status,
                            updatedAt: message.sentAt.toString(),
                        }
                        : chat
                    )

                    updatedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

                    if (!state.selectedChat || state.selectedChat.chatId != message.chatId) {
                        return { chats: updatedChats }
                    }

                    if (!state.selectedChat.messages) return state

                    const updatedMessages = [...state.selectedChat.messages]
                    updatedMessages[newMessageIndex] = message

                    return { selectedChat: { ...state.selectedChat, messages: updatedMessages }, chats: updatedChats }
                })
            })

            set({ socket: hubConnection })
        } catch (error) {
            if (error instanceof Error && error.message.includes("Status code '401'")) {
                useAuthStore.getState().logout()
            }
        }
    },
    disconnect: async () => {
        const { socket } = get()

        await socket?.stop()

        set({ chats: [], selectedChat: null })
    },
    sendMessage: async (message: MessageModel) => {
        const { socket, selectedChat } = get()

        if (!selectedChat || selectedChat.chatId <= 0) return

        selectedChat.messages?.push(message)

        if (socket?.state == "Connected") {
            try {
                const newMessageIndex = selectedChat.messages?.findIndex(msg => msg.id == message.id)
                await socket?.invoke("SendMessage", message, newMessageIndex)
            } catch (error) {
                message.status = "Error"
                console.error("SignalR: Failed to send message:", error);
            }
        } else {
            message.status = "Error"
            console.warn("SignalR: No connection available to send message.");
        }
    },
    getChats: async () => {
        const { socket } = get()

        set({ isChatsLoading: true })

        const result: Array<Chat> = await GetUserChatsApi()

        await Promise.all(result.map(async (chat) => {
            const [unreadMessages, lastMessage] = await Promise.all([
                socket?.invoke("GetChatSentMessages", chat.chatId),
                socket?.invoke("GetChatLastMessage", chat.chatId),
            ]);

            chat.unreadMessages = unreadMessages;

            if (Date.parse(lastMessage.sentAt) != Date.parse(chat.updatedAt)) {
                await UpdateChatLastMessageTimeApi(lastMessage.chatId, lastMessage.sentAt);
            }

            chat.lastMessage = lastMessage.content;
            chat.lastMessageSenderId = lastMessage.senderId
            chat.lastMessageStatus = lastMessage.status
            chat.updatedAt = lastMessage.sentAt;
        }));

        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        set({ chats: result, isChatsLoading: false })
    },
    setSelectedChat: async (chat) => {
        if (!chat) return set({ selectedChat: null })

        if (!chat.chatId) {
            const result = await GetSearchedUserChatApi(chat.userName)
            if (result.id && result.id > 0) {
                Object.assign(chat, {
                    chatId: result.id,
                })
            }
        }

        if (chat.chatId) {
            const { socket } = get()

            if (socket?.state == "Connected") {
                try {
                    await socket.invoke("SetChatMessagesRead", chat.chatId)
                    const chatMessages = await socket.invoke("GetChatInitialMessages", chat.chatId)

                    Object.assign(chat, {
                        messages: chatMessages
                    })
                } catch (error) {
                    console.error("SignalR: Failed to send message:", error)
                }
            } else {
                console.warn("SignalR: No connection available to send message.")
            }
        }

        set({ selectedChat: chat })
    },
    getChatOlderMessages: async (chat) => {
        const { socket } = get()

        if (!chat || !chat.messages || get().selectedChat?.chatId != chat.chatId) return

        set({ isFetchingMessages: true })

        const olderMessages = await socket?.invoke("GetChatOlderMessages", chat.chatId, chat.messages[0].sentAt)

        if (olderMessages.length == 0) return set({ isFetchingMessages: false })

        const updatedMessages = [...chat.messages]
        updatedMessages.unshift(...olderMessages)

        set({ selectedChat: { ...chat, messages: updatedMessages }, isFetchingMessages: false })
    },
    createDmChat: async (receiverUserName) => {
        const response = await CreateDmChatApi(receiverUserName)
        get().getChats()

        return response.chatId
    }
}))