import * as chakra from "@chakra-ui/react"

function ContactSkeleton() {
    return (
        <chakra.Flex gap={"3"} p={"2"} mt={"1"} borderRadius={"md"} >
            {/* Avatar Skeleton */}
            <chakra.SkeletonCircle size={"3rem"} />

            {/* Message Details */}
            <chakra.Flex justify={"center"} direction={"column"} flex={"1 1 0%"}>
                <chakra.Skeleton height="12px" width="60%" mb={"2px"} />
                <chakra.Skeleton height="10px" width="80%" />
            </chakra.Flex>

            {/* Timestamp Skeleton */}
            <chakra.Flex flexDir={"column"} align={"center"} justify={"space-evenly"} fontSize={"xs"}>
                <chakra.Skeleton height="10px" width="40px" />
                <chakra.Circle opacity={"0"} size={"20px"} />
            </chakra.Flex>
        </chakra.Flex>
    )
}

export default ContactSkeleton