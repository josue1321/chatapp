import React from "react"
import * as chakra from "@chakra-ui/react"
import { CheckCheckIcon, CheckIcon } from "../assets/Icons"
import { IonIcon } from "@ionic/react";
import { alertCircleOutline, timeOutline } from "ionicons/icons";

type MessageProps = {
    isSender?: boolean;
    text: string;
    sentAtString: Date
    status: "Waiting" | "Sent" | "Read" | "Error"
}

function Message({ isSender, text, sentAtString, status }: MessageProps) {
    const senderBg = chakra.useColorModeValue("hsl(220 35% 75%)", "hsl(220 35% 25%)")
    const receiverBg = chakra.useColorModeValue("light.secondary", "dark.secondary")
    const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground")

    const sentAt = new Date(sentAtString)

    const getStatusIcon = () => {
        switch (status) {
            case "Waiting":
                return <chakra.Center ml={"2"} fontSize={"14"}><IonIcon icon={timeOutline} /></chakra.Center>
            case "Error":
                return <chakra.Center ml={"2"} fontSize={"14"}><IonIcon icon={alertCircleOutline} /></chakra.Center>
            case "Sent":
                return <CheckIcon ml={"2"} fontSize={"md"} />
            case "Read":
                return <CheckCheckIcon ml={"2"} fontSize={"md"} />
        }
    }

    return (
        <chakra.Flex justify={isSender ? "end" : "none"}>
            <chakra.Flex direction={"column"} minW={"60px"} maxW={"75%"} borderRadius={"md"} bgColor={isSender ? senderBg : receiverBg} p={"2"} fontSize={"sm"}>
                <chakra.Text wordBreak={"break-word"} whiteSpace={"pre-wrap"}>{text}</chakra.Text>
                <chakra.Flex mt={"2"} align={"center"} justify={"space-between"} fontSize={"xs"} color={mutedFg}>
                    <chakra.Text>{sentAt.getHours().toString().padStart(2, '0')} : {sentAt.getMinutes().toString().padStart(2, '0')}</chakra.Text>
                    {isSender && getStatusIcon()}
                </chakra.Flex>
            </chakra.Flex>
        </chakra.Flex>
    )
}

export default React.memo(Message)