import React from 'react';
import { mockDB } from '../../utils/mockDB';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

const AdminDashboard = () => {
    const users = mockDB.getUsers();
    const subjects = mockDB.getSubjects();

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
        { label: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'bg-purple-500' },
        { label: 'Active Sessions', value: '12', icon: GraduationCap, color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
                        <div className={`p-4 rounded-lg ${stat.color} text-white mr-4`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <button onClick={() => window.location.href = '/admin/users'} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition">Manage Users</button>
                    <button onClick={() => window.location.href = '/admin/subjects'} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition">Manage Subjects</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
