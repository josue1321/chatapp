import * as chakra from "@chakra-ui/react"
import { IonIcon } from "@ionic/react"
import { eyeOffOutline, eyeOutline, lockClosed, logoGoogle } from "ionicons/icons"
import { Link } from "react-router-dom"
import { useState } from "react"
import * as yup from "yup"
import { useAuthStore } from "../store/useAuthStore"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

type RegisterFormsInput = {
	username: string,
	email: string,
	password: string
}

const validation = yup.object().shape({
	username: yup.string().required("Username is required").matches(/^[^\s@]*$/, "Invalid username: spaces and '@' are not allowed"),
	email: yup.string().required("Email is required").email('must be a valid email'),
	password: yup.string().required("Password is required")
		.min(6, "Password must be at least 6 characters long")
		.matches(/[A-Z]/, "Password must have at least one uppercase")
		.matches(/[a-z]/, "Password must have at least one lowercase")
		.matches(/\d/, "Password must have at least one digit ('0'-'9')")
		.matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must have at least one non alphanumeric character"),

})

function RegisterPage() {
	const bg = chakra.useColorModeValue("light.secondary", "dark.background")
	const card = chakra.useColorModeValue("light.card", "dark.card")
	const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground")

	const { registerUser, isSigningUp } = useAuthStore()

	const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormsInput>({ resolver: yupResolver(validation) })

	const handleRegister = (form: RegisterFormsInput) => {
		registerUser(form.username, form.email, form.password)
	}

	const [showPassword, setShowPassword] = useState(false)
	const handleClick = () => setShowPassword(!showPassword)

	return (
		<chakra.Flex minH={"100vh"} bgColor={bg}>
			<chakra.Flex flex={"1 1 0%"} direction={"column"} align={"center"} justify={"center"} >
				<chakra.Box maxW={"md"} shadow={"2xl"} rounded={"lg"} p={"8"} backgroundColor={card}>
					<chakra.Flex direction={"column"} align={"center"} gap={"1.5"}>
						<IonIcon icon={lockClosed} />
						<chakra.Text as={"h2"} fontSize={"3xl"} fontWeight={"bold"}>Register a new account</chakra.Text>
					</chakra.Flex>

					<chakra.Box mt={"8"}>
						<form onSubmit={handleSubmit(handleRegister)}>
							<chakra.VStack spacing={"6"}>
								<chakra.FormControl>
									<chakra.FormLabel>Username</chakra.FormLabel>
									<chakra.Input type="text" required {...register("username")} />
									{errors.username ? <chakra.Text fontSize={"xs"} color={"crimson"} fontStyle={"italic"} fontWeight={"bold"}>{errors.username.message}</chakra.Text> : ""}
								</chakra.FormControl>

								<chakra.FormControl>
									<chakra.FormLabel>Email Address</chakra.FormLabel>
									<chakra.Input type="email" required {...register("email")} />
									{errors.email ? <chakra.Text fontSize={"xs"} color={"crimson"} fontStyle={"italic"} fontWeight={"bold"}>{errors.email.message}</chakra.Text> : ""}
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
								</chakra.FormControl>

								<chakra.Button w={"full"} type="submit" isLoading={isSigningUp}>Sign up</chakra.Button>
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
							<chakra.Text as={"span"}>Already have an account? </chakra.Text>
							<Link to={"/login"}><chakra.Button fontSize={"sm"} variant={"link"}>Login here</chakra.Button></Link>
						</chakra.Box>
					</chakra.Box>
				</chakra.Box>
			</chakra.Flex>
		</chakra.Flex>
	);
}

export default RegisterPage