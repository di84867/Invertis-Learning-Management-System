const seedData = {
    users: [
        {
            id: 'S001', password: 'password', name: 'John Doe', role: 'student',
            dept: 'B.Tech', branch: 'CS', year: '3', section: 'A',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
            isLocked: false,
            // Mock Results:
            internalMarks: [
                { subjectId: 'CN', title: 'Computer Networks', type: 'Mid-Sem', maxMarks: 50, marksObtained: 42, remarks: 'Good', status: 'graded' },
                { subjectId: 'CD', title: 'Compiler Design', type: 'Mid-Sem', maxMarks: 50, marksObtained: 35, remarks: 'Average', status: 'graded' },
                { subjectId: 'AI', title: 'Artificial Intelligence', type: 'Assignment', maxMarks: 10, marksObtained: 9, remarks: 'Excellent', status: 'graded' }
            ]
        },
        {
            id: 'T001', password: 'password', name: 'Dr. Smith', role: 'teacher',
            dept: 'B.Tech', branch: 'CS',
            avatar: 'https://ui-avatars.com/api/?name=Dr+Smith&background=random',
            isLocked: false,
            assignedSubjects: [
                { code: 'Thermo', name: 'Thermodynamics', section: 'A', year: '2', branch: 'ME' }
            ]
        },

        { id: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', avatar: '', isLocked: false }
    ],
    courses: [
        { id: 'CN', name: 'Computer Networks', code: 'CS-301', dept: 'btech', branch: 'Computer Science (CS)' },
        { id: 'CD', name: 'Compiler Design', code: 'CS-302', dept: 'btech', branch: 'Computer Science (CS)' },
        { id: 'AI', name: 'Artificial Intelligence', code: 'CS-303', dept: 'btech', branch: 'Computer Science (CS)' },
        { id: 'Thermo', name: 'Thermodynamics', code: 'ME-201', dept: 'btech', branch: 'Mechanical (ME)' }
    ],
    assignments: [
        // Type: 'assignment' or 'quiz'
        { id: 'A1', type: 'assignment', category: 'lab', title: 'Lab Manual 1', subjectId: 'CN', maxMarks: 50, dueDate: '2025-11-20', isLocked: false, department: 'B.Tech', branch: 'CS', year: '3', section: 'A' },
        { id: 'Q1', type: 'quiz', category: 'quiz', title: 'Unit 1 Quiz', subjectId: 'CN', maxMarks: 20, dueDate: '2025-11-25', isLocked: false, department: 'B.Tech', branch: 'CS', year: '3', section: 'A' },
        { id: 'A2', type: 'assignment', category: 'general', title: 'Parser Implementation', subjectId: 'CD', maxMarks: 100, dueDate: '2025-12-05', isLocked: true, department: 'B.Tech', branch: 'CS', year: '3', section: 'A' }
    ],
    submissions: [
        { id: 'SUB1', assignmentId: 'A1', studentId: 'S001', submittedUrl: 'file.pdf', marksObtained: 42, remarks: 'Good work', status: 'graded', submittedAt: '2025-11-19T10:00:00Z' },
        { id: 'SUB2', assignmentId: 'Q1', studentId: 'S001', submittedUrl: 'answers.json', marksObtained: 18, remarks: 'Excellent', status: 'graded', submittedAt: '2025-11-24T10:00:00Z' }
    ],
    news: [
        { id: 1, title: "Internal Assessment Results Out!", date: "Jan 10, 2026", content: "The results for the odd semester internal assessment have been published. Students can view them in their dashboard.", image: "images/logo.png" },
        { id: 2, title: "Invertis University Ranked Top in UP", date: "Dec 28, 2025", content: "Invertis University has been awarded the Best Private University in Uttar Pradesh for the year 2025.", image: "images/news1.jpg" },
        { id: 3, title: "Annual Sports Meet 2025 Announced", date: "Jan 05, 2026", content: "The much awaited Annual Sports Meet is scheduled to begin from January 15th. Registration is open.", image: "images/sports.jpg" }
    ],
    events: [
        { id: 1, title: "Tech Fest 2026", date: "2026-02-20", location: "Main Auditorium", description: "A 3-day technical festival showcasing innovation.", image: "images/techfest.jpg" },
        { id: 2, title: "Alumni Meet", date: "2026-03-15", location: "University Lawn", description: "Reconnect with your alma mater and batchmates.", image: "images/alumni.jpg" }
    ],
    appConfig: {
        landingTitle: "Welcome to Invertis <br><span class=\"text-blue-400\">Learning Management System</span>",
        landingBg: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop",
        resultPublished: false // Admin "Unlock for All" feature
    }
};

const DB_KEYS = {
    USERS: 'lms_users',
    ASSIGNMENTS: 'lms_assignments',
    SUBMISSIONS: 'lms_submissions',
    COURSES: 'lms_courses',
    NEWS: 'lms_news',
    EVENTS: 'lms_events',
    CONFIG: 'lms_config'
};

// Start Initialize
(function initDB() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(seedData.users));
    }
    if (!localStorage.getItem(DB_KEYS.ASSIGNMENTS)) {
        localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(seedData.assignments));
    }
    if (!localStorage.getItem(DB_KEYS.SUBMISSIONS)) {
        localStorage.setItem(DB_KEYS.SUBMISSIONS, JSON.stringify(seedData.submissions));
    }
    // For Demo: Overwrite courses to ensure depts/branches are present
    localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(seedData.courses));
    // For News - Overwrite to ensure new Seed data shows on reload for demo
    // The user explicitly wants "Result Out" message.
    // In a real app we wouldn't overwrite, but for this demo fix we must to ensure visual correctness
    // unless the "admin" adds it manually. I'll overwrite for now.
    localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(seedData.news));

    if (!localStorage.getItem(DB_KEYS.EVENTS)) {
        localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(seedData.events));
    }

    if (!localStorage.getItem(DB_KEYS.CONFIG)) {
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(seedData.appConfig));
    } else {
        // Force Repair title 
        let conf = JSON.parse(localStorage.getItem(DB_KEYS.CONFIG));
        if (conf.landingTitle && !conf.landingTitle.includes('<span')) {
            conf.landingTitle = seedData.appConfig.landingTitle;
            localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(conf));
        }
    }
})();

// Data Access Layer
const LMS_DB = {
    getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
    getAssignments: () => JSON.parse(localStorage.getItem(DB_KEYS.ASSIGNMENTS) || '[]'),
    getSubmissions: () => JSON.parse(localStorage.getItem(DB_KEYS.SUBMISSIONS) || '[]'),
    getCourses: () => JSON.parse(localStorage.getItem(DB_KEYS.COURSES) || '[]'),
    getNews: () => JSON.parse(localStorage.getItem(DB_KEYS.NEWS) || '[]'),
    getEvents: () => JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]'),
    getAppConfig: () => JSON.parse(localStorage.getItem(DB_KEYS.CONFIG) || '{}'),

    updateAppConfig: (newConfig) => {
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(newConfig));
    },

    getStudentResults: (studentId) => {
        const users = LMS_DB.getUsers();
        const student = users.find(u => u.id === studentId);
        if (!student) return [];

        // Merge internal marks with assignment submissions
        const internal = student.internalMarks || [];

        // Real assignments
        const allAssigns = LMS_DB.getAssignments();
        // Filter assignments for this student's class
        const studentAssigns = allAssigns.filter(a =>
            a.department === student.dept &&
            a.branch === student.branch &&
            a.year == student.year // loose match for string/number
        );

        const submissions = LMS_DB.getSubmissions().filter(s => s.studentId === studentId);

        // Map assignments to result format
        const assignResults = studentAssigns.map(assign => {
            const sub = submissions.find(s => s.assignmentId === assign.id);
            return {
                subjectId: assign.subjectId,
                title: assign.title,
                type: 'Assignment/Quiz',
                maxMarks: assign.maxMarks,
                marksObtained: sub && sub.status === 'graded' ? sub.marksObtained : 0,
                remarks: sub ? sub.remarks : '',
                status: sub ? sub.status : 'pending', // graded, submitted, pending
                submitted: !!sub
            };
        });

        return [...internal, ...assignResults];
    },

    addNews: (newsItem) => {
        const list = LMS_DB.getNews();
        newsItem.id = list.length + 1;
        list.unshift(newsItem);
        localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(list));
    },

    addEvent: (eventItem) => {
        const list = LMS_DB.getEvents();
        eventItem.id = list.length + 1;
        list.unshift(eventItem);
        localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(list));
    },

    submitAssignment: (submission) => {
        const list = LMS_DB.getSubmissions();
        submission.id = 'SUB' + (list.length + 1);
        submission.submittedAt = new Date().toISOString();
        submission.status = 'submitted';
        list.push(submission);
        localStorage.setItem(DB_KEYS.SUBMISSIONS, JSON.stringify(list));
    },

    // User Management
    addUser: (newUser) => {
        const users = LMS_DB.getUsers();
        if (users.some(u => u.id === newUser.id)) {
            throw new Error('User ID already exists');
        }
        // Default avatar
        if (!newUser.avatar) {
            newUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`;
        }
        newUser.isLocked = false; // Default unlocked
        users.push(newUser);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        return true;
    },

    updateUser: (updatedUser) => {
        const users = LMS_DB.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    deleteUser: (userId) => {
        let users = LMS_DB.getUsers();
        const exists = users.some(u => u.id === userId);
        if (exists) {
            users = users.filter(u => u.id !== userId);
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    toggleUserLock: (userId, status) => {
        const users = LMS_DB.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.isLocked = status;
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }
    },

    changePassword: (userId, newPass) => {
        const users = LMS_DB.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.password = newPass;
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    resetPassword: (userId, newPass) => {
        // Same as changePassword but semantically admin action
        return LMS_DB.changePassword(userId, newPass);
    },

    createAssignment: (assignment) => {
        const list = LMS_DB.getAssignments();
        assignment.id = (assignment.type === 'quiz' ? 'Q' : 'A') + (list.length + 100);
        assignment.category = 'general';
        list.push(assignment);
        localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(list));
    },

    addCourse: (course) => {
        const list = LMS_DB.getCourses();
        list.push(course);
        localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(list));
    },

    deleteCourse: (courseId) => {
        let list = LMS_DB.getCourses();
        list = list.filter(c => c.id !== courseId);
        localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(list));
    },

    updateAppConfig: (newConfig) => {
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(newConfig));
    }
};
