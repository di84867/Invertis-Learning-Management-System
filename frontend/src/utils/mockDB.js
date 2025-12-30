export const DB_KEYS = {
    USERS: 'lms_users_v3',
    SUBJECTS: 'lms_subjects_v3',
    GROUPS: 'lms_groups_v3',
    HIERARCHY: 'lms_hierarchy_v3'
};

// Initial Hierarchy Structure
const seedHierarchy = {
    courses: [
        {
            id: 'BTECH',
            name: 'B.Tech',
            branches: [
                {
                    id: 'CS',
                    name: 'Computer Science',
                    specializations: [],
                    years: [
                        {
                            id: '1',
                            semesters: [
                                { id: '1', sections: ['A', 'B'] },
                                { id: '2', sections: ['A', 'B'] }
                            ]
                        },
                        {
                            id: '2',
                            semesters: [
                                { id: '3', sections: ['A', 'B'] },
                                { id: '4', sections: ['A', 'B'] }
                            ]
                        },
                        {
                            id: '3',
                            semesters: [
                                { id: '5', sections: ['A', 'B'] },
                                { id: '6', sections: ['A', 'B'] }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'MBA',
            name: 'MBA',
            branches: [
                {
                    id: 'GEN',
                    name: 'General',
                    years: [{ id: '1', semesters: [{ id: '1', sections: ['A'] }] }]
                }
            ]
        }
    ]
};

// User Groups Definition
// Groups define features access. 
const seedGroups = [
    { id: 'admin_grp', name: 'Administrators', capabilities: ['all'] },
    { id: 'teacher_grp', name: 'Faculty', capabilities: ['grading', 'view_subjects', 'upload_content'] },
    { id: 'student_grp', name: 'Students', capabilities: ['view_subjects', 'submit_assignments', 'view_results'] }
];

const seedUsers = [
    {
        id: 'S001',
        name: 'Divyansh Singh',
        groupId: 'student_grp',
        role: 'student',

        // Hierarchy Hooks
        courseId: 'BTECH',
        branchId: 'CS',
        yearId: '3',
        semesterId: '5',
        sectionId: 'A',

        password: 'password123',
        mustChangePassword: true, // Force change on first login
        avatar: 'https://i.pravatar.cc/150?u=S001'
    },
    {
        id: 'T001',
        name: 'Dr. Smith',
        groupId: 'teacher_grp',
        role: 'teacher',

        // Teacher mapped to branch/dept usually
        courseId: 'BTECH',
        branchId: 'CS',

        password: 'admin',
        mustChangePassword: true,
        avatar: 'https://i.pravatar.cc/150?u=T001'
    },
    {
        id: 'A001',
        name: 'Admin User',
        groupId: 'admin_grp',
        role: 'admin',
        password: 'admin',
        mustChangePassword: false, // Admin usually set up securely initially, or can flag true
        avatar: ''
    }
];

const seedSubjects = [
    { id: 'CN', name: 'Computer Networks', code: 'CS-301', coverImage: null },
    { id: 'CD', name: 'Compiler Design', code: 'CS-302', coverImage: null },
];

// Initialize Data
const initData = () => {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem(DB_KEYS.SUBJECTS)) {
        localStorage.setItem(DB_KEYS.SUBJECTS, JSON.stringify(seedSubjects));
    }
    if (!localStorage.getItem(DB_KEYS.GROUPS)) {
        localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(seedGroups));
    }
    if (!localStorage.getItem(DB_KEYS.HIERARCHY)) {
        localStorage.setItem(DB_KEYS.HIERARCHY, JSON.stringify(seedHierarchy));
    }
};

initData();

export const mockDB = {
    // Basic Getters
    getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
    getGroups: () => JSON.parse(localStorage.getItem(DB_KEYS.GROUPS) || '[]'),
    getHierarchy: () => JSON.parse(localStorage.getItem(DB_KEYS.HIERARCHY) || '{}'),
    getSubjects: () => JSON.parse(localStorage.getItem(DB_KEYS.SUBJECTS) || '[]'),

    // Setters
    setUsers: (users) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
    setGroups: (grps) => localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(grps)),
    setHierarchy: (data) => localStorage.setItem(DB_KEYS.HIERARCHY, JSON.stringify(data)),

    // Hierarchy Management
    addCourse: (courseName, courseId) => {
        const h = mockDB.getHierarchy();
        if (!h.courses) h.courses = [];
        if (h.courses.find(c => c.id === courseId)) return false; // Exists

        h.courses.push({
            id: courseId,
            name: courseName,
            branches: []
        });
        mockDB.setHierarchy(h);
        return true;
    },

    addBranch: (courseId, branchName, branchId) => {
        const h = mockDB.getHierarchy();
        const course = h.courses.find(c => c.id === courseId);
        if (!course) return false;

        if (!course.branches) course.branches = [];
        if (course.branches.find(b => b.id === branchId)) return false;

        course.branches.push({
            id: branchId,
            name: branchName,
            specializations: [],
            years: [] // could init default years
        });
        mockDB.setHierarchy(h);
        return true;
    },

    addSpecialization: (courseId, branchId, specName, specId) => {
        const h = mockDB.getHierarchy();
        const course = h.courses.find(c => c.id === courseId);
        if (!course) return false;

        const branch = course.branches.find(b => b.id === branchId);
        if (!branch) return false;

        if (!branch.specializations) branch.specializations = [];
        if (branch.specializations.find(s => s.id === specId)) return false;

        branch.specializations.push({
            id: specId,
            name: specName
        });
        mockDB.setHierarchy(h);
        return true;
    },

    // Auth
    login: (id, password) => {
        const users = mockDB.getUsers();
        const user = users.find(u => u.id === id && u.password === password);
        return user || null;
    },

    // Admin Actions
    resetPassword: (targetId, newPass) => {
        const users = mockDB.getUsers();
        const idx = users.findIndex(u => u.id === targetId);
        if (idx !== -1) {
            users[idx].password = newPass;
            users[idx].mustChangePassword = true; // Resetting implies they must set a new one
            mockDB.setUsers(users);
            return true;
        }
        return false;
    },

    changePassword: (userId, newPass) => {
        const users = mockDB.getUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users[idx].password = newPass;
            users[idx].mustChangePassword = false; // Fulfilled
            mockDB.setUsers(users);
            return true;
        }
        return false;
    },

    updateSubjectCover: (subjectId, imageUrl) => {
        const subs = mockDB.getSubjects();
        const idx = subs.findIndex(s => s.id === subjectId);
        if (idx !== -1) {
            subs[idx].coverImage = imageUrl;
            mockDB.setSubjects(subs);
            return true;
        }
        return false;
    },

    addSubject: (newSubject) => {
        const subs = mockDB.getSubjects();
        // Generate a simple ID if not present
        if (!newSubject.id) {
            newSubject.id = newSubject.code || Math.random().toString(36).substr(2, 9).toUpperCase();
        }
        subs.push(newSubject);
        mockDB.setSubjects(subs);
        return true;
    },

    // Hierarchy Helpers (Mock)
    // Create/Modify hierarchy would go here for Admin
};

