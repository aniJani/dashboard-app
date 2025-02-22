"use client";

import type { User } from "@/lib/firebase";
import {
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "@/lib/firebase";
import React, { FormEvent, useEffect, useState } from "react";

const Signup: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Function to handle sign up
    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Cache the UID in localStorage
            localStorage.setItem("userID", result.user.uid);
            setUser(result.user);
        } catch (err: any) {
            console.error("Error signing up:", err);
            setError(err.message);
        }
    };

    // Listen for authentication state changes
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
                    Signup successful! Welcome, {user.email} (UID: {user.uid})
                </p>
            ) : (
                <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-md">
                    <label htmlFor="signup-email">Email:</label>
                    <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />

                    <label htmlFor="signup-password">Password:</label>
                    <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />

                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Sign Up
                    </button>
                </form>
            )}
        </div>
    );
};

export default Signup;
