import { Flex, useColorModeValue } from "@chakra-ui/react"
import SideBar from "../components/SideBar"
import ChatPanel from "../components/ChatPanel"
import { useChatStore } from "../store/useChatStore"

function ChatPage() {
    const bg = useColorModeValue("light.background", "dark.background")

    const { selectedChat } = useChatStore()

    return (
            <Flex w={"full"} h={"100vh"} bgColor={bg}>
                <SideBar />

                {selectedChat ? <ChatPanel /> : ""}
            </Flex>
    )
}

export default ChatPage