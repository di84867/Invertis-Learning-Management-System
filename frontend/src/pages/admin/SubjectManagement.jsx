import React, { useState, useEffect } from 'react';
import { mockDB } from '../../utils/mockDB';
import { Upload, Book, Image as ImageIcon } from 'lucide-react';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [hierarchy, setHierarchy] = useState({ courses: [] });
    // Structure Form States
    const [newCourse, setNewCourse] = useState({ name: '', id: '' });
    const [newBranch, setNewBranch] = useState({ courseId: '', name: '', id: '' });
    const [newSpec, setNewSpec] = useState({ courseId: '', branchId: '', name: '', id: '' });

    useEffect(() => {
        setSubjects(mockDB.getSubjects());
        setHierarchy(mockDB.getHierarchy());
    }, []);



    const handleAddSpec = (e) => {
        e.preventDefault();
        if (!newSpec.courseId || !newSpec.branchId) {
            alert("Select Course and Branch");
            return;
        }
        if (mockDB.addSpecialization(newSpec.courseId, newSpec.branchId, newSpec.name, newSpec.id)) {
            setHierarchy(mockDB.getHierarchy());
            setNewSpec({ ...newSpec, name: '', id: '' });
            alert('Specialization Added');
        } else {
            alert('Error adding specialization');
        }
    };

    const handleImageUpload = (subjectId, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert("File too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                mockDB.updateSubjectCover(subjectId, base64);
                setSubjects(mockDB.getSubjects()); // Refresh
                alert("Cover updated!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCourse = (e) => {
        e.preventDefault();
        if (mockDB.addCourse(newCourse.name, newCourse.id)) {
            setHierarchy(mockDB.getHierarchy());
            setNewCourse({ name: '', id: '' });
            alert('Course Added');
        } else {
            alert('Error: ID likely exists');
        }
    };

    const handleAddBranch = (e) => {
        e.preventDefault();
        if (!newBranch.courseId) {
            alert("Please select a course first");
            return;
        }
        if (mockDB.addBranch(newBranch.courseId, newBranch.name, newBranch.id)) {
            setHierarchy(mockDB.getHierarchy());
            setNewBranch({ ...newBranch, name: '', id: '' });
            alert('Branch Added');
        } else {
            alert('Error adding branch (ID might exist)');
        }
    };

    const handleAddSubject = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSubject = {
            name: formData.get('name'),
            code: formData.get('code'),
            course: formData.get('course'),
            branch: formData.get('branch'),
            semester: formData.get('semester'),
            coverImage: null
        };

        mockDB.addSubject(newSubject);
        setSubjects(mockDB.getSubjects());
        e.target.reset();
        alert('Subject Added Successfully!');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Subject Management</h1>
            <p className="text-slate-500">Upload cover photos for subjects visible to students and teachers.</p>

            {/* Structure Management Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-4 text-slate-700">1. Add New Course</h3>
                    <form onSubmit={handleAddCourse} className="space-y-3">
                        <input className="w-full border p-2 rounded" placeholder="Course Name (e.g. B.Com)" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} required />
                        <input className="w-full border p-2 rounded" placeholder="Course ID (e.g. BCOM)" value={newCourse.id} onChange={e => setNewCourse({ ...newCourse, id: e.target.value })} required />
                        <button className="bg-slate-800 text-white px-4 py-2 rounded w-full">Add Course</button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-4 text-slate-700">2. Add Branch</h3>
                    <form onSubmit={handleAddBranch} className="space-y-3">
                        <select className="w-full border p-2 rounded bg-white" value={newBranch.courseId} onChange={e => setNewBranch({ ...newBranch, courseId: e.target.value })} required>
                            <option value="">Select Course</option>
                            {hierarchy.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input className="w-full border p-2 rounded" placeholder="Branch Name" value={newBranch.name} onChange={e => setNewBranch({ ...newBranch, name: e.target.value })} required />
                        <input className="w-full border p-2 rounded" placeholder="Branch ID" value={newBranch.id} onChange={e => setNewBranch({ ...newBranch, id: e.target.value })} required />
                        <button className="bg-slate-800 text-white px-4 py-2 rounded w-full">Add Branch</button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-4 text-slate-700">3. Add Specialization</h3>
                    <form onSubmit={handleAddSpec} className="space-y-3">
                        <select className="w-full border p-2 rounded bg-white" value={newSpec.courseId} onChange={e => setNewSpec({ ...newSpec, courseId: e.target.value, branchId: '' })} required>
                            <option value="">Select Course</option>
                            {hierarchy.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select className="w-full border p-2 rounded bg-white" value={newSpec.branchId} onChange={e => setNewSpec({ ...newSpec, branchId: e.target.value })} required disabled={!newSpec.courseId}>
                            <option value="">Select Branch</option>
                            {newSpec.courseId && hierarchy.courses.find(c => c.id === newSpec.courseId)?.branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <input className="w-full border p-2 rounded" placeholder="Spec Name (e.g. AI/ML)" value={newSpec.name} onChange={e => setNewSpec({ ...newSpec, name: e.target.value })} required />
                        <input className="w-full border p-2 rounded" placeholder="Spec ID (e.g. AIML)" value={newSpec.id} onChange={e => setNewSpec({ ...newSpec, id: e.target.value })} required />
                        <button className="bg-slate-800 text-white px-4 py-2 rounded w-full">Add Spec</button>
                    </form>
                </div>
            </div>

            {/* Create Subject Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-600" /> Add New Subject
                </h2>
                <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject Name</label>
                        <input required type="text" placeholder="e.g. Data Structures" className="w-full border p-2 rounded" name="name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject Code</label>
                        <input required type="text" placeholder="e.g. CS-201" className="w-full border p-2 rounded" name="code" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Course</label>
                        <select name="course" className="w-full border p-2 rounded bg-white" required>
                            {hierarchy.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch</label>
                        <select name="branch" className="w-full border p-2 rounded bg-white" required onChange={(e) => {
                            // Force re-render or handle state if needed, but standard form data collection works
                            // However, to show dynamic specs, we might need state for selectedCourse and selectedBranch in this form?
                            // Yes, 'subjects' creation form is uncontrolled currently.
                            // I will switch to uncontrolled with simple visual logic, or just let users traverse.
                            // Actually, let's keep it simple: Add Spec column.
                        }}>
                            <option value="">Select Branch</option>
                            {hierarchy.courses.map(c =>
                                c.branches.map(b => (
                                    <option key={b.id} value={b.id}>{c.id} - {b.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Specialization (Optional)</label>
                        <input type="text" name="specialization" placeholder="e.g. AI/ML (if applicable)" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Semester</label>
                        <select name="semester" className="w-full border p-2 rounded bg-white">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                            Add Subject
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                        <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                            {subject.coverImage ? (
                                <img src={subject.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                    <span className="text-sm">No Cover Image</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-100 flex items-center">
                                    <Upload size={16} className="mr-2" /> Change Cover
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(subject.id, e)} />
                                </label>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                    {subject.course} / {subject.branch}
                                </span>
                                <span className="text-xs font-bold text-slate-400">Sem {subject.semester}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                {subject.code}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">{subject.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectManagement;
