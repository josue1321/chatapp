import { createStandaloneToast } from "@chakra-ui/react";

const api = import.meta.env.VITE_USER_API + "/User/";

const { toast } = createStandaloneToast()

export const SearchUserApi = async (identifier: string) => {
    try {
        const response = await fetch(api + identifier, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            switch (response.status) {
                case 500:
                    toast({
                        title: "Search failed",
                        description: "Something went wrong. Please try again later.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })

                    return
                case 404:
                    toast({
                        title: "User not found",
                        status: "warning",
                        duration: 5000,
                        isClosable: true
                    })

                    return
            }
        }

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in SearchUserApi:", err)
    }
}