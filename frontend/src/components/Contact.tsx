import React from "react";
import * as chakra from "@chakra-ui/react";
import { CheckCheckIcon, CheckIcon } from "../assets/Icons";
import { IonIcon } from "@ionic/react";
import { alertCircleOutline, timeOutline } from "ionicons/icons";

type ContactProps = {
    isActive?: boolean;
    avatar?: string;
    name: string;
    unreadMessages?: number
    lastMessage?: string;
    senderLastMessage?: boolean;
    lastMessageDateString: string;
    lastMessageStatus?: string
    onClick: () => void
}

function Contact({ isActive, avatar, name, unreadMessages, lastMessage, senderLastMessage, lastMessageDateString, lastMessageStatus, onClick }: ContactProps) {
    const bg = chakra.useColorModeValue("light.muted", "dark.muted")
    const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground")
    const notificationBg = chakra.useColorModeValue("hsl(220 35% 75%)", "hsl(220 35% 25%)")

    const lastMessageTime = new Date(lastMessageDateString)

    const lastMessageTimeStringFormatted = lastMessageTime.toDateString() == new Date().toDateString()
        ? `${lastMessageTime.getHours().toString().padStart(2, '0')} : ${lastMessageTime.getMinutes().toString().padStart(2, '0')}`
        : `${lastMessageTime.getDate()}/${lastMessageTime.getMonth()}/${lastMessageTime.getFullYear()}`

    const getStatusIcon = () => {
        switch (lastMessageStatus) {
            case "Waiting":
                return <chakra.Center fontSize={"14"}><IonIcon icon={timeOutline} /></chakra.Center>
            case "Error":
                return <chakra.Center fontSize={"14"}><IonIcon icon={alertCircleOutline} /></chakra.Center>
            case "Sent":
                return <CheckIcon fontSize={"md"} />
            case "Read":
                return <CheckCheckIcon fontSize={"md"} />
        }
    }

    return (
        <chakra.Flex onClick={onClick} gap={"3"} p={"2"} mt={"1"} transition={"0.2s"} bgColor={isActive ? bg : "inherit"} _hover={{ bgColor: bg, cursor: "pointer" }} borderRadius={"md"}>
            <chakra.Avatar name={name} src={avatar} />

            <chakra.Flex justify={"center"} direction={"column"} flex={"1 1 0%"}>
                <chakra.Text fontSize={"sm"}>{name}</chakra.Text>
                <chakra.Flex fontSize={"xs"} color={mutedFg}>
                   <chakra.Text mr={"2px"}>{senderLastMessage && getStatusIcon()}</chakra.Text> 
                   <chakra.Text>{(lastMessage ? lastMessage.substring(0, 25) : "") + (lastMessage && lastMessage.length > 25 ? "..." : "")}</chakra.Text> 
                </chakra.Flex>
            </chakra.Flex>

            <chakra.Flex flexDir={"column"} align={"center"} justify={"space-evenly"} fontSize={"xs"} color={mutedFg}>
                {lastMessageTimeStringFormatted}

                <chakra.Center backgroundColor={unreadMessages! > 0 ? notificationBg : ""} transition={"background-color 0.1s ease-out"} w={"20px"} h={"20px"} rounded={"full"} >
                    <chakra.Text transition={"opacity 0.1s ease-out"}>{unreadMessages! > 0 ? unreadMessages : ""}</chakra.Text>
                </chakra.Center>
            </chakra.Flex>
        </chakra.Flex>
    )
}

export default React.memo(Contact)