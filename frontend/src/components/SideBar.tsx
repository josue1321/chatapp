import * as chakra from "@chakra-ui/react"
import Contact from "./Contact"
import { ellipsisVertical, search, add } from "ionicons/icons"
import { IonIcon } from "@ionic/react"
import { useAuthStore } from "../store/useAuthStore"
import SearchUserModal from "./SearchUserModal"
import { useChatStore } from "../store/useChatStore"
import ContactSkeleton from "./ContactSkeleton"
import { useCallback, useEffect, useState } from "react"
import { Chat } from "../models/Chat"

function SideBar() {
	const { colorMode, toggleColorMode } = chakra.useColorMode()

	const bg = chakra.useColorModeValue("light.card", "dark.card")
	const borderColor = chakra.useColorModeValue("light.border", "dark.border")
	const accent = chakra.useColorModeValue("light.accent", "dark.accent")

	const { user, logout } = useAuthStore()
	const { chats, isChatsLoading, selectedChat, setSelectedChat } = useChatStore()

	const { isOpen, onOpen, onClose } = chakra.useDisclosure()

	const handleSelectChat = useCallback((chat: Chat) => {
		setSelectedChat(chat)
	}, [setSelectedChat])

	const [filteredChats, setFilteredChats] = useState(chats)

	useEffect(() => setFilteredChats(chats), [chats])

	const handleSearch = (query: string) => {
		setFilteredChats(chats.filter((chat) => chat.userName.toLowerCase().includes(query.toLowerCase()) || chat.email.toLowerCase().includes(query.toLowerCase()) || chat.fullName?.toLowerCase().includes(query.toLowerCase())))
	}

	return (
		<chakra.Flex w={"96"} direction={"column"} bgColor={bg} borderRight={"solid 1px"} borderColor={borderColor}>
			{/* Top */}
			<chakra.Flex gap={"2"} px={"4"} py={"3"} align={"center"}>
				<chakra.Avatar size={"sm"} name={user?.userName} src={user?.avatarUrl} />

				<chakra.Text flex={"1 1 0%"} fontWeight={"bold"} fontSize={"lg"} fontFamily={"Manrope"}>Chat</chakra.Text>

				<chakra.IconButton onClick={onOpen} aria-label="Add Chat" icon={<IonIcon icon={add} />} fontSize={"28px"} variant={"ghost"} isRound _hover={{ bgColor: accent }} />

				<SearchUserModal isOpen={isOpen} onClose={onClose} />

				<chakra.Menu>
					<chakra.MenuButton as={chakra.IconButton} aria-label="Menu" icon={<IonIcon icon={ellipsisVertical} />} fontSize={"20px"} variant={"ghost"} isRound _hover={{ bgColor: accent }} />

					<chakra.MenuList>
						<chakra.MenuItem onClick={toggleColorMode}>Use {colorMode === "light" ? "dark" : "light"} Mode</chakra.MenuItem>
						<chakra.MenuItem onClick={logout}>Logout</chakra.MenuItem>
					</chakra.MenuList>
				</chakra.Menu>
			</chakra.Flex>

			{/* Search Bar */}
			<chakra.Center px={"4"} py={"3"}>
				<chakra.InputGroup>
					<chakra.InputLeftElement pointerEvents={"none"} fontSize={"20"}>
						<IonIcon icon={search} />
					</chakra.InputLeftElement>
					<chakra.Input placeholder="Search..." variant={"filled"} borderRadius={"full"} _focus={{ borderColor: borderColor }} onChange={(e) => handleSearch(e.target.value)} />
				</chakra.InputGroup>
			</chakra.Center>

			{/* Contacts */}
			<chakra.Flex position={"relative"} flex={"1 1 0%"} overflow={chats ? "auto" : "hidden"}>
				<chakra.Box w={"full"} h={"full"}>
					<chakra.Box minW={"100%"} display={"table"}>
						<chakra.Box p={"2"}>
							{isChatsLoading
								? Array.from({ length: 14 }, (_, index) => <ContactSkeleton key={index} />)
								: filteredChats.map((chat) => {
									return (<Contact
										key={chat.chatId}
										onClick={() => handleSelectChat(chat)}
										isActive={chat.chatId == selectedChat?.chatId}
										avatar={chat.avatarUrl}
										name={chat.userName}
										unreadMessages={chat.unreadMessages}
										senderLastMessage={chat.lastMessageSenderId == user?.id}
										lastMessageStatus={chat.lastMessageStatus}
										lastMessage={chat.lastMessage}
										lastMessageDateString={chat.updatedAt}
									/>)
								})}
						</chakra.Box>
					</chakra.Box>
				</chakra.Box>
			</chakra.Flex>
		</chakra.Flex>
	)
}

export default SideBar