import * as chakra from "@chakra-ui/react"
import Message from "./Message"
import { IonIcon } from "@ionic/react"
import { attach, ellipsisVertical, happyOutline, paperPlaneOutline, search } from "ionicons/icons"
import { useEffect, useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { MessageModel } from "../models/Message"
import { useAuthStore } from "../store/useAuthStore"

const MessagePanel = () => {
    const fg = chakra.useColorModeValue("light.foreground", "dark.foreground")
    const accent = chakra.useColorModeValue("light.accent", "dark.accent")
    const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground")
    const mutedBg = chakra.useColorModeValue("light.muted", "dark.muted")

    const { user } = useAuthStore()
    const { selectedChat, setSelectedChat, getChatOlderMessages, isFetchingMessages, createDmChat, sendMessage } = useChatStore()

    const [messageText, setMessageText] = useState<string>("")

    const textAreaRef = useRef<null | HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const messageContainerRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = (behavior: ScrollBehavior) => {
        messagesEndRef.current?.scrollIntoView({ behavior })
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!messageContainerRef.current) return

            if (messageContainerRef.current.scrollTop < 50 && !isFetchingMessages) {
                getChatOlderMessages(selectedChat)
            }
        }

        const container = messageContainerRef.current
        container?.addEventListener("scroll", handleScroll)

        return () => {
            container?.removeEventListener("scroll", handleScroll)
        }
    })

    useEffect(() => {
        scrollToBottom("auto")
    }, [selectedChat?.chatId])

    const adjustTextareaHeight = (textArea: HTMLTextAreaElement | null, messageSended: boolean) => {
        if (!textArea) return
        if (messageSended) textArea.value = ""

        textArea.style.height = "40px";
        textArea.style.height = `${textArea.scrollHeight}px`;
    };

    const handleMessage = async () => {
        if (!messageText || !user || !selectedChat) return

        const newChatId = !selectedChat.chatId ? await createDmChat(selectedChat.userName) : null

        if (newChatId) {
            await setSelectedChat({ ...selectedChat, chatId: newChatId })
        }

        const message: MessageModel = {
            id: "NewMessage" + Math.floor(Math.random() * Math.pow(10, 14)).toString(),
            senderId: user.id,
            chatId: selectedChat.chatId ?? newChatId!,
            content: messageText,
            sentAt: new Date(),
            status: "Waiting",
        }

        message.content = message.content.replace(/[\u200B\u00A0]/g, "")
        message.content = message.content.replace("\r\n", "\n")
        message.content = message.content.trim()
        message.content = message.content.replace(/\n{3,}/g, "\n\n")

        if (message.content.length != 0) {
            sendMessage(message)
            setMessageText("")

            adjustTextareaHeight(textAreaRef.current, true)
            scrollToBottom("smooth")
        }
    }

    return (
        <chakra.Flex flex={"1 1 0%"} direction={"column"}>
            <chakra.Flex align={"center"} gap={"3"} px={"4"} py={"3"} borderBottom={"solid 1px"} borderColor={"inherit"}>
                <chakra.Avatar name={selectedChat?.userName} src={selectedChat?.avatarUrl} />

                <chakra.Flex justify={"center"} direction={"column"} flex={"1 1 0%"}>
                    <chakra.Text fontSize={"md"}>{selectedChat?.fullName ? `${selectedChat.fullName} (${selectedChat.userName})` : selectedChat?.userName}</chakra.Text>
                </chakra.Flex>

                <chakra.IconButton aria-label="Search Message" icon={<IonIcon icon={search} />} fontSize={"22px"} variant={"ghost"} color={fg} isRound _hover={{ bgColor: accent }} />

                <chakra.Menu>
                    <chakra.MenuButton as={chakra.IconButton} aria-label="Menu" icon={<IonIcon icon={ellipsisVertical} />} fontSize={"20px"} variant={"ghost"} color={fg} isRound _hover={{ bgColor: accent }} />

                    <chakra.MenuList>
                        <chakra.MenuItem onClick={() => setSelectedChat(null)}>Close Chat</chakra.MenuItem>
                    </chakra.MenuList>
                </chakra.Menu>
            </chakra.Flex>

            <chakra.Flex position={"relative"} ref={messageContainerRef} overflow={"auto"} p={"4"} flex={"1 1 0%"} css={{ scrollbarWidth: "thin" }}>
                <chakra.Box w={"full"} h={"full"}>
                    {isFetchingMessages &&
                        <chakra.Center position={"absolute"} left={"50%"} backgroundColor={mutedBg} height={"50px"} width={"50px"} borderRadius={"100%"}>
                            <chakra.Spinner size={"lg"} />
                        </chakra.Center>
                    }

                    <chakra.Box minW={"full"} display={"table"}>
                        <chakra.Flex direction={"column"} gap={"4"}>
                            {selectedChat?.messages?.map((message) => <Message key={message.id} text={message.content} isSender={message.senderId == user?.id} sentAtString={message.sentAt} status={message.status} />)}
                            <chakra.Box ref={messagesEndRef} />
                        </chakra.Flex>
                    </chakra.Box>
                </chakra.Box>
            </chakra.Flex>

            <chakra.Flex gap={"3"} px={"4"} py={"3"} alignItems={"center"} borderTop={"solid 1px"} borderColor={"inherit"}>
                <chakra.IconButton aria-label="Send File" icon={<IonIcon icon={attach} />} fontSize={"24px"} variant={"ghost"} color={fg} isRound _hover={{ bgColor: accent }} />

                <chakra.IconButton aria-label="Emoji" icon={<IonIcon icon={happyOutline} />} fontSize={"24px"} variant={"ghost"} color={fg} isRound _hover={{ bgColor: accent }} />

                <chakra.Textarea value={messageText} ref={textAreaRef} onChange={(e) => { setMessageText(e.target.value); adjustTextareaHeight(e.target, false); }} alignContent={"center"} minH={"40px"} maxH={"200px"} placeholder="Type your message..." bgColor={mutedBg} _placeholder={{ color: mutedFg }} borderRadius={"2xl"} fontSize={"sm"} px={"4"} py={"2"} border={"none"} _focus={{ shadow: "none" }} resize={"none"} />

                <chakra.IconButton aria-label="Send Message" icon={<IonIcon icon={paperPlaneOutline} />} fontSize={"22px"} variant={"ghost"} color={fg} isRound _hover={{ bgColor: accent }} onClick={handleMessage} />
            </chakra.Flex>
        </chakra.Flex>
    )
}

export default MessagePanel