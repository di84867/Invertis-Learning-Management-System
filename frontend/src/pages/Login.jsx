import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/invertis_logo_final.png';
import { Lock } from 'lucide-react';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // New Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [tempUser, setTempUser] = useState(null);

    const [error, setError] = useState('');
    const { login, completePasswordChange } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(id, password);

        if (result.success) {
            navigate('/' + result.role);
        } else if (result.requiresChange) {
            setIsChangingPassword(true);
            setTempUser(result.user);
            setError('');
        } else {
            setError(result.message);
        }
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        const success = completePasswordChange(tempUser.id, newPassword);
        if (success) {
            navigate('/' + tempUser.role);
        } else {
            setError("Failed to update password.");
        }
    };

    if (isChangingPassword) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-blue-300 w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Change Password</h1>
                        <p className="text-blue-200 text-sm">You must change your password to continue.</p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="New password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/30 transition"
                        >
                            Update & Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <img src={logo} alt="LMS Logo" className="h-16 mx-auto mb-4 bg-white rounded-lg p-2" />
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to Learning Management System</h1>
                    <p className="text-blue-200">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">User ID</label>
                        <input
                            type="text"
                            required
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="e.g. S001, T001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-blue-300/60">
                    Forgot your password? Contact Administration
                </div>
            </div>
        </div>
    );
};

export default Login;
