/**
 * Simple Mock Data Store using LocalStorage to simulate a backend Database
 */

const DB_KEYS = {
    USERS: 'lms_users',
    ASSIGNMENTS: 'lms_assignments',
    SUBMISSIONS: 'lms_submissions',
    COURSES: 'lms_courses'
};

// Initial Seed Data
const seedData = {
    users: [
        { id: 'S001', name: 'Divyansh Singh', role: 'student', dept: 'B.Tech', branch: 'CS', year: '3', section: 'A', avatar: 'https://i.pravatar.cc/150?u=S001' },
        { id: 'S002', name: 'Rohan Sharma', role: 'student', dept: 'B.Tech', branch: 'CS', year: '3', section: 'B', avatar: 'https://i.pravatar.cc/150?u=S002' },
        { id: 'S003', name: 'Priya Verma', role: 'student', dept: 'B.Tech', branch: 'ME', year: '2', section: 'A', avatar: 'https://i.pravatar.cc/150?u=S003' },

        // Teachers
        { id: 'T001', name: 'Dr. Smith', role: 'teacher', dept: 'B.Tech', branch: 'CS', subjects: ['CN', 'CD'], avatar: 'https://i.pravatar.cc/150?u=T001' },
        { id: 'T002', name: 'Prof. Johnson', role: 'teacher', dept: 'B.Tech', branch: 'ME', subjects: ['Thermo'], avatar: 'https://i.pravatar.cc/150?u=T002' },

        { id: 'A001', name: 'Admin User', role: 'admin', avatar: '' }
    ],
    courses: [
        { id: 'CN', name: 'Computer Networks', code: 'CS-301' },
        { id: 'CD', name: 'Compiler Design', code: 'CS-302' },
        { id: 'AI', name: 'Artificial Intelligence', code: 'CS-303' },
        { id: 'TQM', name: 'Total Quality Management', code: 'HU-301' }
    ],
    assignments: [
        // Type: 'assignment' or 'quiz'
        { id: 'A1', type: 'assignment', category: 'lab', title: 'Lab Manual 1', subjectId: 'CN', maxMarks: 50, dueDate: '2025-11-20' },
        { id: 'Q1', type: 'quiz', category: 'quiz', title: 'Unit 1 Quiz', subjectId: 'CN', maxMarks: 20, dueDate: '2025-11-25' },
        { id: 'A2', type: 'assignment', category: 'general', title: 'Parser Implementation', subjectId: 'CD', maxMarks: 100, dueDate: '2025-12-05' }
    ],
    submissions: [
        { id: 'SUB1', assignmentId: 'A1', studentId: 'S001', submittedUrl: 'file.pdf', marksObtained: 42, remarks: 'Good work', status: 'graded' },
        { id: 'SUB2', assignmentId: 'Q1', studentId: 'S001', submittedUrl: 'answers.json', marksObtained: 18, remarks: 'Excellent', status: 'graded' }
    ]
};

// Initialize DB
function initDB() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(seedData.users));
        localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(seedData.courses));
        localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(seedData.assignments));
        localStorage.setItem(DB_KEYS.SUBMISSIONS, JSON.stringify(seedData.submissions));
        console.log('Database Seeded');
    }
}

// Data Access Object
const LMS_DB = {
    getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
    getAssignments: () => JSON.parse(localStorage.getItem(DB_KEYS.ASSIGNMENTS) || '[]'),
    getSubmissions: () => JSON.parse(localStorage.getItem(DB_KEYS.SUBMISSIONS) || '[]'),
    getCourses: () => JSON.parse(localStorage.getItem(DB_KEYS.COURSES) || '[]'),

    // Get submissions for a student with assignment details merged
    getStudentResults: (studentId) => {
        const submissions = LMS_DB.getSubmissions().filter(s => s.studentId === studentId);
        const assignments = LMS_DB.getAssignments();

        return assignments.map(assign => {
            const sub = submissions.find(s => s.assignmentId === assign.id);
            return {
                ...assign,
                submitted: !!sub,
                marksObtained: sub ? sub.marksObtained : 0,
                status: sub ? sub.status : 'pending',
                remarks: sub ? sub.remarks : ''
            };
        });
    },

    // Teacher: Update marks
    gradeSubmission: (assignmentId, studentId, marks, remarks) => {
        const submissions = LMS_DB.getSubmissions();
        const index = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);

        if (index >= 0) {
            submissions[index].marksObtained = parseFloat(marks);
            submissions[index].remarks = remarks;
            submissions[index].status = 'graded';
        } else {
            // Create new record if somehow grading non-existent submission (or manual entry)
            submissions.push({
                id: 'SUB-' + Date.now(),
                assignmentId,
                studentId,
                marksObtained: parseFloat(marks),
                remarks,
                status: 'graded'
            });
        }
        localStorage.setItem(DB_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    },

    // Create Assignment
    createAssignment: (data) => {
        const list = LMS_DB.getAssignments();
        list.push({
            ...data,
            id: 'NEW-' + Date.now(),
            isLocked: false // Default open
        });
        localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(list));
    },

    // Reset Password Mock
    resetPassword: (userId, newPassword) => {
        const users = LMS_DB.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            console.log(`Password for ${user.name} (${userId}) reset to: ${newPassword}`);
            return true;
        }
        return false;
    },

    // Toggle Assignment Lock Status
    toggleLock: (assignmentId, status) => {
        const list = LMS_DB.getAssignments();
        const item = list.find(a => a.id === assignmentId);
        if (item) {
            item.isLocked = status;
            localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(list));
            return true;
        }
        return false;
    },

    // Init Logic
    init: () => initDB()
};

// Initialize immediately
LMS_DB.init();
