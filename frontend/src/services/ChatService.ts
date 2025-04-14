const api = import.meta.env.VITE_USER_API + "/Chat/";

export const GetUserChatsApi = async () => {
    try {
        const response = await fetch(api + "GetUserChats", {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in GetUserChats:", err)
    }
}

export const UpdateChatLastMessageTimeApi = async (chatId: number, updateAt: Date) => {
    try {
        await fetch(api + "UpdateChatLastMessageTime", {
            method: "Put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                chatId,
                updateAt
            }) 
        })
    } catch (err) {
        console.log("Error ir UpdateChatLastMessageTime:", err)
    }
}

export const GetSearchedUserChatApi = async (username: string) => {
    try {
        const response = await fetch(api + "GetSearchedUserChat/" + username, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in GetSearchedUserChatApi:", err)
    }
}

export const CreateDmChatApi = async (receiverUserName: string) => {
    try {
        const response = await fetch(api + "CreateDmChat", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: `"${receiverUserName}"`
        });

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in CreateDmChatApi:", err)
    }
}