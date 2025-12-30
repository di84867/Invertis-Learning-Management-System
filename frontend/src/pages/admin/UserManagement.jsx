import React, { useState, useEffect } from 'react';
import { mockDB } from '../../utils/mockDB';
import { Search, Edit2, RotateCcw, Save, X, Trash2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        setUsers(mockDB.getUsers());
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter(u =>
        u.id.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.course && u.course.toLowerCase().includes(search.toLowerCase()))
    );

    const handleEdit = (user) => {
        setEditingUser({ ...user }); // Clone
    };

    const handleSave = () => {
        const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
        mockDB.setUsers(updatedUsers);
        setUsers(updatedUsers);
        setEditingUser(null);
        alert('User Updated Successfully');
    };

    const handleResetPassword = (id) => {
        if (confirm('Reset password for ' + id + ' to default "password123"?')) {
            mockDB.resetPassword(id, 'password123');
            alert('Password Reset to "password123"');
            setUsers(mockDB.getUsers());
        }
    };

    const handleResetAll = () => {
        if (confirm('Are you ABSOLUTELY SURE? This will reset ALL passwords.')) {
            const resetList = users.map(u => ({ ...u, password: 'password123' }));
            mockDB.setUsers(resetList);
            setUsers(resetList);
            alert('All passwords reset.');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <button onClick={handleResetAll} className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-200">
                    Reset All Passwords
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Course..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-slate-500">User ID</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Name</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Role</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Course Info</th>
                            <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full" />
                                        {user.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 capitalize">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {user.role === 'student' ? (
                                        `${user.course} - ${user.branch} (Yr: ${user.year})`
                                    ) : (user.role === 'teacher' ? (
                                        `Dept: ${user.dept}`
                                    ) : 'N/A')}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit User">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleResetPassword(user.id)} className="p-2 text-orange-600 hover:bg-orange-50 rounded" title="Reset Password">
                                        <RotateCcw size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="p-8 text-center text-slate-500">No users found.</div>}
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit User: {editingUser.id}</h2>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full border p-2 rounded" />
                            </div>

                            {editingUser.role !== 'admin' && (
                                <>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium mb-1">Role Group</label>
                                        <select
                                            value={editingUser.groupId || ''}
                                            onChange={e => setEditingUser({ ...editingUser, groupId: e.target.value })}
                                            className="w-full border p-2 rounded bg-white">
                                            <option value="">Select Group</option>
                                            <option value="student_grp">Student Group</option>
                                            <option value="teacher_grp">Faculty Group</option>
                                            <option value="admin_grp">Admin Group</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium mb-1">Course (ID)</label>
                                        <input type="text" value={editingUser.course || editingUser.courseId || ''} onChange={e => setEditingUser({ ...editingUser, courseId: e.target.value, course: e.target.value })} className="w-full border p-2 rounded" placeholder="BTECH, MBA..." />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium mb-1">Branch (ID)</label>
                                        <input type="text" value={editingUser.branch || editingUser.branchId || ''} onChange={e => setEditingUser({ ...editingUser, branchId: e.target.value, branch: e.target.value })} className="w-full border p-2 rounded" placeholder="CS, ME..." />
                                    </div>
                                </>
                            )}

                            {editingUser.role === 'student' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Year</label>
                                        <select value={editingUser.yearId || editingUser.year || ''} onChange={e => setEditingUser({ ...editingUser, yearId: e.target.value, year: e.target.value })} className="w-full border p-2 rounded bg-white">
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Semester</label>
                                        <input type="text" value={editingUser.semesterId || editingUser.semester || ''} onChange={e => setEditingUser({ ...editingUser, semesterId: e.target.value, semester: e.target.value })} className="w-full border p-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Section</label>
                                        <input type="text" value={editingUser.sectionId || editingUser.section || ''} onChange={e => setEditingUser({ ...editingUser, sectionId: e.target.value, section: e.target.value })} className="w-full border p-2 rounded" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                                <Save size={16} className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
