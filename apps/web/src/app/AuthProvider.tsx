"use client"

import { me } from '@/lib/api/auth'
import { createContext, ReactNode, useEffect, useState } from 'react'

type User = {
        id: string;
        email: string;
        displayName: string;
    };

type AuthContextValue = {
    user: User,
    setUser: (user: User) => void,
    resetUser: () => void,
    isLoading: boolean
}

const defaultUser = {
        id: "",
        email: "",
        displayName: "User"
    }

export const AuthContext = createContext<AuthContextValue>({
    user: defaultUser,
    setUser: () => {},
    resetUser: () => {},
    isLoading: false
})


function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User>(defaultUser);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const resetUser = () => {setUser(defaultUser)}

    useEffect(() => {
        const restoreSession = async () => {
            try {
                setIsLoading(true)
                const res = await me();
                setUser({...res, id: res.sub})
            } catch {
                resetUser()
            } finally {
                setIsLoading(false)
            }
        }
        restoreSession();
    }, [])
    
  return (
    <AuthContext.Provider value={{user, setUser, resetUser, isLoading}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider