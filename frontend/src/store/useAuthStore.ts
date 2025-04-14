import { CheckApi, LoginApi, RegisterApi } from "../services/AuthService"
import { UserProfile } from "../models/User";
import { create } from "zustand";
import { createStandaloneToast } from "@chakra-ui/react";
import { useChatStore } from "./useChatStore";

const { toast } = createStandaloneToast()

type AuthState = {
    user: UserProfile | null
    token: string
    isSigningUp: boolean
    isLoggingIn: boolean
    isCheckingLogin: boolean
    registerUser: (username: string, email: string, password: string) => void
    loginUser: (identifier: string, password: string) => void
    logout: () => void
    isLoggedIn: () => boolean
    checkLogin: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem("token") || "",

    isSigningUp: false,
    isLoggingIn: false,
    isCheckingLogin: true,

    registerUser: async (username: string, email: string, password: string) => {
        set({ isSigningUp: true });
        try {
            const res = await RegisterApi(username, email, password);

            if (res.errors) {
                throw new Error(Array.isArray(res.errors) ? res.errors[0].description : res.errors);
            }

            localStorage.setItem("token", res.token);
            const userObj = {
                id: res.id,
                userName: res.userName,
                email: res.email,
            };

            set({ token: res.token, user: userObj });

            await useChatStore.getState().connectSocket()
            useChatStore.getState().getChats()

            toast({
                title: "Registration successful!",
                description: `Welcome, ${res.userName}!`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Registration failed",
                description: "Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            console.log(error)
        } finally {
            set({ isSigningUp: false });
        }
    },
    loginUser: async (identifier: string, password: string) => {
        set({ isLoggingIn: true });
        try {
            const res = await LoginApi(identifier, password);

            if (res.errors) {
                throw new Error(Array.isArray(res.errors) ? res.errors[0].description : res.errors);
            }

            localStorage.setItem("token", res.token);
            const userObj = {
                id: res.id,
                userName: res.userName,
                email: res.email,
                avatarUrl: res.avatarUrl,
                fullName: res.fullName
            };

            set({ token: res.token, user: userObj });

            await useChatStore.getState().connectSocket()
            useChatStore.getState().getChats()

            toast({
                title: "Login successful!",
                description: `Welcome back, ${res.userName}!`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Login failed",
                description: "An error occurred while logging in.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            console.log(error)
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: () => {
        localStorage.removeItem("token")
        set({ user: null, token: "" })
        useChatStore.getState().disconnect()
    },
    isLoggedIn: () => {
        const { user } = get()
        return !!user
    },
    checkLogin: async () => {
        set({ token: localStorage.getItem("token") || "" })

        try {
            if (!get().token) return

            const res = await CheckApi()

            if (res.errors) {
                throw new Error(Array.isArray(res.errors) ? res.errors[0].description : res.errors);
            }

            const userObj = {
                id: res.id,
                userName: res.userName,
                email: res.email,
                avatarUrl: res.avatarUrl,
                fullName: res.fullName
            };

            set({ user: userObj });

            await useChatStore.getState().connectSocket()
            useChatStore.getState().getChats()
        } catch (error) {
            localStorage.removeItem("token")
            set({ user: null });

            if (error instanceof Error && error.message == "401") {
                return
            }

            console.error("Error in checkAuth:", error);
        } finally {
            set({ isCheckingLogin: false })
        }
    },
}))