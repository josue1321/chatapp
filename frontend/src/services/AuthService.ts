const api = import.meta.env.VITE_USER_API + "/Auth/";


export const LoginApi = async (identifier: string, password: string) => {
    try {
        const response = await fetch(api + "Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, password })
        });

        if (response.status == 500)
            return { errors: "Something went wrong. Please try again later." }

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in LoginApi:", err)
    }
}

export const RegisterApi = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch(api + "Register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error in RegisterApi:", err)
    }
}

export const CheckApi = async () => {
    try {
        const response = await fetch(api + "Check", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (response.status == 401)
            return { errors: "401" }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}