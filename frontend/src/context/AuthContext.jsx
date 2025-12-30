import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDB } from '../utils/mockDB';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('lms_current_user_v3');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = (id, password) => {
        const foundUser = mockDB.login(id, password);
        if (foundUser) {
            // Check if forced password change
            if (foundUser.mustChangePassword) {
                // We return a specific code so Login page knows to show "Change Password" screen
                return { success: false, requiresChange: true, user: foundUser };
            }
            setUser(foundUser);
            localStorage.setItem('lms_current_user_v3', JSON.stringify(foundUser));
            return { success: true, role: foundUser.role };
        }
        return { success: false, message: 'Invalid Credentials' };
    };

    const completePasswordChange = (id, newPassword) => {
        const success = mockDB.changePassword(id, newPassword);
        if (success) {
            // Auto login after change
            const updatedUser = mockDB.login(id, newPassword);
            setUser(updatedUser);
            localStorage.setItem('lms_current_user_v3', JSON.stringify(updatedUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lms_current_user_v3');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, completePasswordChange, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
