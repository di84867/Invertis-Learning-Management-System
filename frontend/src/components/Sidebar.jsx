import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    LogOut,
    Settings
} from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const getLinks = () => {
        switch (user.role) {
            case 'admin':
                return [
                    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/admin/users', icon: Users, label: 'User Management' },
                    { to: '/admin/subjects', icon: BookOpen, label: 'Subject Management' },
                ];
            case 'teacher':
                return [
                    { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/teacher/grading', icon: GraduationCap, label: 'Grading' },
                ];
            case 'student':
                return [
                    { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/student/subjects', icon: BookOpen, label: 'My Subjects' },
                ];
            default:
                return [];
        }
    };

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <img src="/logo.png" alt="Logo" className="h-8 mr-2 bg-white rounded p-1" />
                <span className="font-bold text-lg leading-tight">LMS</span>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                {getLinks().map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to.split('/').length === 2} // Exact match for root dashboard links
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                                ? 'bg-amber-600 text-white border-r-4 border-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5 mr-3" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-2">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Logged in as</div>
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
