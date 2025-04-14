import { MessageModel } from "./Message";

export type Chat = {
    userName: string
    email: string
    avatarUrl?: string
    fullName?: string
    chatId: number
    lastMessage?: string
    lastMessageSenderId?: string
    lastMessageStatus?: "Waiting" | "Sent" | "Read" | "Error"
    updatedAt: string
    unreadMessages?: number
};

export type SelectedChat = {
    userName: string
    email: string
    avatarUrl?: string
    fullName?: string
    chatId: number
    messages?: Array<MessageModel>
};