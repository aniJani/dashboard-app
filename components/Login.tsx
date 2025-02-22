// components/Login.tsx
"use client";

import type { User } from "@/lib/firebase";
import {
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "@/lib/firebase";
import React, { FormEvent, useEffect, useState } from "react";

const Login: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Function to handle the login process
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Cache the user ID (UID) in localStorage
            localStorage.setItem("userID", result.user.uid);
            setUser(result.user);
        } catch (err: any) {
            console.error("Error signing in:", err);
            setError(err.message);
        }
    };

    // Monitor auth state changes so we keep our UI in sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                localStorage.setItem("userID", currentUser.uid);
            } else {
                setUser(null);
                localStorage.removeItem("userID");
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-4">
            {user ? (
                <p>
                    Welcome, {user.email} (UID: {user.uid})
                </p>
            ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-md">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        className="border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-600">{error}</p>}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Login
                    </button>
                </form>
            )}
        </div>
    );
};

export default Login;
