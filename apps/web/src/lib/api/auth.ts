const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AuthUser = {
    id: string;
    email: string;
    displayName: string;
};

type LoginResult = {
    user: AuthUser;
};

export const register = async (email: string, displayName: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, displayName, password})
    })

    if (!res.ok) {
        const {message} = await res.json()
        throw new Error(`Failed to register: ${message}`)
    }

    return res.json();
}

export const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })

    if (!res.ok) {
        throw new Error("Failed to login")
    }

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export const logout = async () => {
    await fetch("/api/auth/logout", {
        method: "POST",
    });

    localStorage.removeItem("user");
}


// export const me = async () => {
//     const res = await fetch(`${API_BASE_URL}/auth/me`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })

//     if (!res.ok) {
//         throw new Error("Failed to register")
//     }

//     return res.json();
// }
