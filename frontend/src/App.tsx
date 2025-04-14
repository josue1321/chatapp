import { Center, Progress } from "@chakra-ui/react"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"

function App() {

	const { isCheckingLogin, checkLogin, isLoggedIn } = useAuthStore()

	useEffect(() => {
		checkLogin()
	}, [checkLogin])

	return isCheckingLogin && !isLoggedIn() ? (
		<Center w={"full"} h={"100vh"}>
			<Progress size='xs' isIndeterminate />
		</Center>
	) : (<Outlet />)
}

export default App
