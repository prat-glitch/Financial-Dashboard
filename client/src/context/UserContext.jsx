import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("expense_track_user");
        return savedUser ? JSON.parse(savedUser) : {
            name: "Pratyush Ghosh",
            email: "pratyush@example.com",
            phone: "+91 98765 43210",
            avatar: "",
        };
    });

    useEffect(() => {
        localStorage.setItem("expense_track_user", JSON.stringify(user));
    }, [user]);

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
