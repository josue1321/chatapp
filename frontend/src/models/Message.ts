export type MessageModel = {
    id: string
    senderId: string
    chatId: number
    content: string
    sentAt: Date
    status: "Waiting" | "Sent" | "Read" | "Error"
    mediaUrl?: string
    replyTo?: string
}