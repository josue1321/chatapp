import * as chakra from "@chakra-ui/react"

function ForgotPasswordPage() {
	const bg = chakra.useColorModeValue("light.secondary", "dark.background")
	const card = chakra.useColorModeValue("light.card", "dark.card")

	return (
		<chakra.Flex minH={"100vh"} bgColor={bg}>
			<chakra.Flex flex={"1 1 0%"} direction={"column"} align={"center"} justify={"center"} >
				<chakra.Box maxW={"md"} shadow={"2xl"} rounded={"lg"} p={"8"} backgroundColor={card}>
					<chakra.Flex direction={"column"} align={"center"} gap={"1.5"}>
						<chakra.Text as={"h2"} fontSize={"3xl"} fontWeight={"bold"}>Reset your Password</chakra.Text>
						<chakra.Text fontSize={"sm"} textAlign={"center"}>Enter your Email address and we will send you instructions to reset your password.</chakra.Text>
					</chakra.Flex>

					<chakra.Box mt={"8"}>
						<form action="#" method="POST">
							<chakra.VStack spacing={"6"}>
								<chakra.FormControl>
									<chakra.FormLabel>Email Address</chakra.FormLabel>
									<chakra.Input type="email" required />
								</chakra.FormControl>

								<chakra.Button w={"full"} type="submit">Send</chakra.Button>
							</chakra.VStack>
						</form>
					</chakra.Box>
				</chakra.Box>
			</chakra.Flex>
		</chakra.Flex>
	);
}

export default ForgotPasswordPage
