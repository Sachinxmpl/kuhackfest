"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@/lib/types";
import { API_BASE_URL } from "@/constants/constants";
import { useRouter, usePathname } from "next/navigation";
import { socketManager } from "@/lib/api";

const ignoredRoutes = ["/login", "/signup", "/"];

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    currentSession: Session | null;
    setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                const result = await response.json();

                if (!result.success) {
                    if (!ignoredRoutes.includes(pathname))
                        router.push("/login")
                }

                setUser(result.data);
            } catch (e) {
                console.error("Failed to fetch user:", e);
                router.push("/login")
            }
        }
        if (token) {
            fetchUser();
            if (!socketManager.isConnected()) {
                socketManager.connect(token);
            }
        } else {
            if (!ignoredRoutes.includes(pathname))
                router.push("/login")
        }
    }, [pathname, router, token]);

    return (
        <UserContext.Provider value={{ user, setUser, currentSession, setCurrentSession }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};