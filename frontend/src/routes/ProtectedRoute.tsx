import { ReactNode } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: ReactNode }

const ProtectedRoute = ({ children }: Props) => {
    const location = useLocation()
    const { isLoggedIn } = useAuthStore()

    return isLoggedIn() ? (<>{children}</>) : (
        <Navigate to={"/login"} state={{ from: location }} replace />
    )
}

export default ProtectedRoute