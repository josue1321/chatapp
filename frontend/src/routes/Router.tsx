import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ChatPage from "../pages/ChatPage"
import ProtectedRoute from "./ProtectedRoute"
import ErrorPage from "../pages/ErrorPage"
import AuthRoute from "./AuthRoute"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "login",
                element: (
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                )
            },
            {
                path: "register",
                element: (
                    <AuthRoute>
                        <RegisterPage />
                    </AuthRoute>
                )
            },
            {
                path: "forgot-password",
                element: <ForgotPasswordPage />
            }
        ],
        errorElement: <ErrorPage />
    },

])