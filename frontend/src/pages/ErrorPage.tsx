import * as chakra from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { sadOutline, refreshOutline  } from "ionicons/icons";

const ErrorPage = () => {
    const bg = chakra.useColorModeValue("light.background", "dark.background")
    const fg = chakra.useColorModeValue("light.foreground", "dark.foreground");
    const muted = chakra.useColorModeValue("light.muted", "dark.muted");
    const mutedFg = chakra.useColorModeValue("light.muted_foreground", "dark.muted_foreground");

    const error = useRouteError() as { status: number; message: string };

    let errorMessage = "Something went wrong. Please try again later.";
    if (error.status === 404) {
        errorMessage = "The page you are looking for could not be found.";
    } else if (error.status === 500) {
        errorMessage = "We're experiencing some issues on our end. Please try again later.";
    } else if (error.status === 403) {
        errorMessage = "You don't have permission to view this page.";
    }

    return (
        <chakra.Flex flex={"1 1 0%"} direction={"column"} align={"center"} justify={"center"} height={"100vh"} bgColor={bg}>
            <chakra.Flex direction={"column"} align={"center"} gap={"4"}>
                <chakra.Icon as={IonIcon} icon={sadOutline} fontSize={"50px"} color={fg} />
                <chakra.Text fontSize={"xl"} color={fg}>
                    Oops! Something went wrong.
                </chakra.Text>
                <chakra.Text color={mutedFg}>
                    {errorMessage}
                </chakra.Text>

                <chakra.Button onClick={() => window.location.reload()} _hover={{ bgColor: muted }} leftIcon={<IonIcon icon={refreshOutline } />}>
                    Reload the Page
                </chakra.Button>
            </chakra.Flex>
        </chakra.Flex>
    );
};

export default ErrorPage;
