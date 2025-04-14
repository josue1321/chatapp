import * as chakra from "@chakra-ui/react"
import { IonIcon } from "@ionic/react"
import { eyeOffOutline, eyeOutline, lockClosed, logoGoogle } from "ionicons/icons"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuthStore } from "../store/useAuthStore"

type LoginFormsInputs = {
	identifier: string;
	password: string;
}

const validation = yup.object().shape({
	identifier: yup.string().required("Username or Email is required"),
	password: yup.string().required("Password is required"),
})

function LoginPage() {
	const bg = chakra.useColorModeValue("light.secondary", "dark.background")
	const card = chakra.useColorModeValue("light.card", "dark.card")
	const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground")

	const { loginUser, isLoggingIn } = useAuthStore()

	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) })

	const handleLogin = (form: LoginFormsInputs) => {
		loginUser(form.identifier, form.password)
	}

	const [showPassword, setShowPassword] = useState(false)
	const handleClick = () => setShowPassword(!showPassword)

	return (
		<chakra.Flex minH={"100vh"} bgColor={bg}>
			<chakra.Flex flex={"1 1 0%"} direction={"column"} align={"center"} justify={"center"} >
				<chakra.Box maxW={"md"} shadow={"2xl"} rounded={"lg"} p={"8"} backgroundColor={card}>
					<chakra.Flex direction={"column"} align={"center"} gap={"1.5"}>
						<IonIcon icon={lockClosed} />
						<chakra.Text as={"h2"} fontSize={"3xl"} fontWeight={"bold"}>Sign in to your account</chakra.Text>
					</chakra.Flex>

					<chakra.Box mt={"8"}>
						<form onSubmit={handleSubmit(handleLogin)}>
							<chakra.VStack spacing={"6"}>
								<chakra.FormControl>
									<chakra.FormLabel>Username or Email Address</chakra.FormLabel>
									<chakra.Input type="text" required {...register("identifier")} />
									{errors.identifier ? <chakra.Text fontSize={"xs"} color={"crimson"} fontStyle={"italic"} fontWeight={"bold"}>{errors.identifier.message}</chakra.Text> : ""}
								</chakra.FormControl>

								<chakra.FormControl>
									<chakra.FormLabel>Password</chakra.FormLabel>
									<chakra.InputGroup>
										<chakra.Input pr='10' type={showPassword ? 'text' : 'password'} required {...register("password")} />
										<chakra.InputRightElement width='10'>
											<chakra.Button variant={"ghost"} size='2xs' onClick={handleClick}>
												{showPassword ? <IonIcon icon={eyeOutline} size="small" /> : <IonIcon icon={eyeOffOutline} size="small" />}
											</chakra.Button>
										</chakra.InputRightElement>
									</chakra.InputGroup>
									{errors.password ? <chakra.Text fontSize={"xs"} color={"crimson"} fontStyle={"italic"} fontWeight={"bold"}>{errors.password.message}</chakra.Text> : ""}

									<Link to={"forgot-password"}><chakra.Button mt={"1"} fontSize={"sm"} variant={"link"}>Forgot your password?</chakra.Button></Link>
								</chakra.FormControl>

								<chakra.Button w={"full"} type="submit" isLoading={isLoggingIn}>Sign in</chakra.Button>
							</chakra.VStack>
						</form>

						<chakra.Box mt={"3"}>
							<chakra.Box position={"relative"}>
								<chakra.Flex position={"absolute"} inset={"0"} align={"center"}>
									<chakra.Box w={"full"} borderTopWidth={"1px"}></chakra.Box>
								</chakra.Flex>

								<chakra.Flex position={"relative"} justify={"center"} fontSize={"sm"}>
									<chakra.Text px={"2"} bgColor={card} color={mutedFg}>Or continue with</chakra.Text>
								</chakra.Flex>
							</chakra.Box>

							<chakra.Flex mt={"3"} gap={"3"} justify={"space-between"}>
								<chakra.IconButton w={"full"} aria-label="Sign in with Google" icon={<IonIcon icon={logoGoogle} />} />
							</chakra.Flex>
						</chakra.Box>

						<chakra.Box mt={"6"} fontSize={"sm"} textAlign={"center"} >
							<chakra.Text as={"span"}>Don't have an account? </chakra.Text>
							<Link to={"/register"}><chakra.Button fontSize={"sm"} variant={"link"}>Register here</chakra.Button></Link>
						</chakra.Box>
					</chakra.Box>
				</chakra.Box>
			</chakra.Flex>
		</chakra.Flex>
	);
}

export default LoginPage
