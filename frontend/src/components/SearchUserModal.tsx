import * as chakra from "@chakra-ui/react"
import { IonIcon } from "@ionic/react"
import { search } from "ionicons/icons"
import { SearchUserApi } from "../services/UserService"
import { useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { Chat } from "../models/Chat"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
}

const SearchUserModal = ({ isOpen, onClose }: ModalProps) => {
    const bg = chakra.useColorModeValue("light.background", "dark.background")
    const accent = chakra.useColorModeValue("light.accent", "dark.accent")
    const borderColor = chakra.useColorModeValue("light.border", "dark.border")

    const { setSelectedChat } = useChatStore()

    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState<Chat>()

    const handleSearch = async () => {
        if (searchTerm) {
            const result = await SearchUserApi(searchTerm)

            if (result) setUser(result)
        }
    }

    return (
        <chakra.Modal isOpen={isOpen} onClose={onClose} isCentered>
            <chakra.ModalOverlay />

            <chakra.ModalContent bg={bg}>
                <chakra.ModalHeader>Search for a User</chakra.ModalHeader>
                <chakra.ModalCloseButton />

                <chakra.ModalBody>
                    <chakra.InputGroup>
                        <chakra.Input placeholder="Enter username or email" variant={"filled"} borderRadius={"lg"} _focus={{ borderColor: borderColor }} onChange={(e) => setSearchTerm(e.target.value)} />
                        <chakra.InputRightElement>
                            <chakra.IconButton aria-label="search" icon={<IonIcon icon={search} />} borderRadius={"none"} borderRightRadius={"lg"} onClick={handleSearch} />
                        </chakra.InputRightElement>
                    </chakra.InputGroup>

                    <chakra.Flex my={4} height={16}>
                        {user ?
                            <chakra.HStack onClick={() => { setSelectedChat(user); onClose() }} w={"100%"} px={1} borderRadius={"lg"} transition={"0.2s"} _hover={{ bgColor: accent, cursor: "pointer" }}>
                                <chakra.Avatar name={user.userName} src={user.avatarUrl} />
                                <chakra.Box>
                                    <chakra.Flex justify={"center"} direction={"column"} flex={"1 1 0%"}>
                                        <chakra.Text>{user.fullName}</chakra.Text>
                                        <chakra.Text>{user.userName}</chakra.Text>
                                    </chakra.Flex>
                                </chakra.Box>
                            </chakra.HStack>
                            : <chakra.Center w={"100%"} h={"100%"}><chakra.Text>Search for a user to talk to</chakra.Text></chakra.Center>}
                    </chakra.Flex>
                </chakra.ModalBody>
            </chakra.ModalContent>
        </chakra.Modal>
    )
}

export default SearchUserModal