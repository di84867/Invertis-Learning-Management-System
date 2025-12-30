import React, { useEffect, useState } from 'react';
import { mockDB } from '../../utils/mockDB';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        setSubjects(mockDB.getSubjects());
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-blue-100">You have upcoming assignments in Computer Networks.</p>
            </div>

            <h3 className="font-bold text-slate-800 text-lg">My Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                            {subject.coverImage ? (
                                <img src={subject.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    <span>No Cover Image</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                {subject.code}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-lg text-slate-800 mb-1">{subject.name}</h3>
                            <p className="text-xs text-slate-500">Divyansh Singh • 3rd Year</p>
                            <button className="mt-4 w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                                View Course
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
