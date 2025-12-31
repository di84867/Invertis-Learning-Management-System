document.addEventListener('DOMContentLoaded', () => {
    // Init View
    showSection('dashboard');
    updateDashboardStats();
});

// Mock Data for Cascading Dropdowns
const branches = {
    'btech': ['Computer Science (CS)', 'Mechanical (ME)', 'Civil (CE)', 'Electrical (EE)'],
    'mba': ['HR', 'Finance', 'Marketing', 'International Business'],
    'bpharm': ['Pharmaceutics', 'Pharmacology'],
    'bsc': ['Physics', 'Chemistry', 'Maths']
};

// Navigation
function showSection(sectionId) {
    ['dashboard', 'students', 'assignments', 'news', 'settings', 'academic'].forEach(id => {
        const sect = document.getElementById('section-' + id);
        if (sect) sect.classList.add('hidden');

        const nav = document.getElementById('nav-' + id);
        if (nav) {
            nav.classList.remove('active', 'bg-amber-50', 'text-amber-600', 'border-r-4', 'border-amber-600');
            nav.classList.add('text-slate-600');
        }
    });

    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.remove('hidden');

    const activeNav = document.getElementById('nav-' + sectionId);
    if (activeNav) {
        activeNav.classList.add('active', 'bg-amber-50', 'text-amber-600', 'border-r-4', 'border-amber-600');
        activeNav.classList.remove('text-slate-600');
    }

    if (sectionId === 'students') loadStudents();
    if (sectionId === 'assignments') loadRecentUploads();
    if (sectionId === 'news') loadNewsEvents();
    if (sectionId === 'settings') loadSettings();
    if (sectionId === 'academic') loadAcademicData();
}

function updateDashboardStats() {
    const users = LMS_DB.getUsers();
    const assigns = LMS_DB.getAssignments();
    const events = LMS_DB.getEvents();

    const uEl = document.getElementById('stat-users');
    const aEl = document.getElementById('stat-assignments');
    const eEl = document.getElementById('stat-events');

    if (uEl) uEl.innerText = users.length;
    if (aEl) aEl.innerText = assigns.length;
    if (eEl) eEl.innerText = events.length;
}

// --- STUDENTS/USERS SECTION ---
let currentUserFilterRole = 'all';

function filterUserRole(role) {
    currentUserFilterRole = role;

    // Update Tab UI
    const tabs = document.querySelectorAll('.user-tab');
    tabs.forEach(t => {
        if (t.innerText.toLowerCase().includes(role) || (role === 'all' && t.innerText === 'All')) {
            t.classList.add('active');
            t.classList.remove('text-slate-500');
        } else {
            t.classList.remove('active');
            t.classList.add('text-slate-500');
        }
    });

    loadStudents();
}

function updateUserBranches() {
    const dept = document.getElementById('user-filter-dept').value;
    const branchSelect = document.getElementById('user-filter-branch');

    branchSelect.innerHTML = '<option value="All">All Branches</option>';

    if (branches[dept]) {
        branches[dept].forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.innerText = b;
            branchSelect.appendChild(opt);
        });
    }
}

function loadStudents() {
    let users = LMS_DB.getUsers();
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Advanced Filters
    const fDept = document.getElementById('user-filter-dept').value;
    const fBranch = document.getElementById('user-filter-branch').value;
    const fSection = document.getElementById('user-filter-section').value;

    // Apply Filters
    if (currentUserFilterRole !== 'all') {
        users = users.filter(u => u.role === currentUserFilterRole);
    }
    if (fDept !== 'All') {
        users = users.filter(u => u.dept && u.dept.toLowerCase() === fDept.toLowerCase());
    }
    if (fBranch !== 'All') {
        users = users.filter(u => u.branch === fBranch);
    }
    if (fSection !== 'All') {
        users = users.filter(u => u.section === fSection);
    }

    // Synch Checkbox
    const config = LMS_DB.getAppConfig();
    const studentCheck = document.getElementById('conf-results-student');
    if (studentCheck) studentCheck.checked = config.resultPublished || false;

    users.forEach(user => {
        const isLocked = user.isLocked === true;
        const tr = document.createElement('tr');
        tr.className = "bg-white border-b hover:bg-slate-50 transition-colors";

        // Contextual Dept Display
        let deptInfo = '-';
        if (user.role === 'student') {
            deptInfo = `<div class="font-bold text-slate-700 uppercase text-xs">${user.dept || '-'}</div>
                        <div class="text-[10px] text-slate-400">${user.branch || 'General'} • Sec ${user.section || 'N/A'} • Year ${user.year || 'N/A'}</div>`;
        } else if (user.role === 'teacher') {
            deptInfo = `<div class="font-bold text-slate-700 uppercase text-xs">${user.dept || '-'}</div>
                        <div class="text-[10px] text-blue-500 font-medium">Faculty of ${user.branch || 'Department'}</div>`;
        } else {
            deptInfo = `<span class="text-xs text-slate-400 italic">System Access</span>`;
        }

        tr.innerHTML = `
            <td class="px-6 py-4 font-mono font-bold text-slate-500">${user.id}</td>
            <td class="px-6 py-4 flex items-center gap-3">
                <div class="relative">
                    <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}" class="w-9 h-9 rounded-full border border-gray-100 shadow-sm">
                    ${isLocked ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>' : ''}
                </div>
                <div>
                    <div class="font-bold text-slate-800">${user.name}</div>
                    <div class="text-[10px] text-slate-400">${isLocked ? 'Account Restricted' : 'Active Account'}</div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'teacher' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}">
                    ${user.role}
                </span>
            </td>
            <td class="px-6 py-4">${deptInfo}</td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                     <button onclick="editUser('${user.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Profile">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                     </button>
                     <button onclick="toggleUserLock('${user.id}', ${!isLocked})" class="p-2 ${isLocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'} rounded-lg transition-colors" title="${isLocked ? 'Unlock' : 'Lock'} Account">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                     </button>
                     <button onclick="deleteUser('${user.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove User">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                     </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function promptPasswordReset(userId) {
    // Re-implementing locally to ensure it takes userId directly
    if (!userId) userId = prompt("Enter the User ID (e.g., S001, T001) to reset password:");
    if (!userId) return;

    const newPass = prompt(`Enter new password for ${userId}:`);
    if (!newPass) return;

    const success = LMS_DB.resetPassword(userId, newPass);
    if (success) {
        alert(`Password for ${userId} has been reset successfully.`);
    } else {
        alert('User not found!');
    }
}

function toggleUserLock(userId, status) {
    if (confirm(status ? `Are you sure you want to LOCK user ${userId}? They will not be able to login.` : `Unlock user ${userId}?`)) {
        if (LMS_DB.toggleUserLock(userId, status)) {
            loadStudents();
        } else {
            alert('User not found');
        }
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        LMS_DB.deleteUser(id);
        loadStudents();
        updateDashboardStats();
    }
}

// --- NEWS & EVENTS SECTION ---
function loadNewsEvents() {
    const news = LMS_DB.getNews();
    const events = LMS_DB.getEvents();

    const newsList = document.getElementById('admin-news-list');
    const eventsList = document.getElementById('admin-events-list');

    newsList.innerHTML = news.map(n => `
        <div class="p-3 border rounded bg-gray-50 flex justify-between items-center">
            <div>
                <p class="font-bold text-sm">${n.title}</p>
                <p class="text-xs text-xs text-gray-500">${n.date}</p>
            </div>
            <button class="text-xs text-red-500">Remove</button>
        </div>
    `).join('');

    eventsList.innerHTML = events.map(e => `
        <div class="p-3 border rounded bg-gray-50 flex justify-between items-center">
            <div>
                <p class="font-bold text-sm">${e.title}</p>
                <p class="text-xs text-xs text-gray-500">${e.date} @ ${e.location}</p>
            </div>
             <button class="text-xs text-red-500">Remove</button>
        </div>
    `).join('');
}

const newsForm = document.getElementById('newsForm');
if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        LMS_DB.addNews(data);
        alert('News Published!');
        e.target.reset();
        loadNewsEvents();
        updateDashboardStats();
    });
}

const eventForm = document.getElementById('eventForm');
if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        LMS_DB.addEvent(data);
        alert('Event Scheduled!');
        e.target.reset();
        loadNewsEvents();
        updateDashboardStats();
    });
}


// --- ASSIGNMENTS SECTION ---
const deptSelect = document.getElementById('dept-select');
const branchSelect = document.getElementById('branch-select');

if (deptSelect) {
    deptSelect.addEventListener('change', function () {
        const selectedDept = this.value;
        branchSelect.innerHTML = '<option selected>Select Branch</option>';

        if (branches[selectedDept]) {
            branches[selectedDept].forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.toLowerCase().replace(/ /g, '-');
                option.textContent = branch;
                branchSelect.appendChild(option);
            });
            branchSelect.disabled = false;
        } else {
            branchSelect.disabled = true;
        }
    });
}

document.getElementById('uploadBtn').addEventListener('click', function () {
    const btn = this;
    const originalText = btn.innerHTML;

    if (deptSelect.value === 'Select Department') {
        alert('Please select a department at minimum.');
        return;
    }

    const assignmentData = {
        title: document.querySelector('input[placeholder="e.g. Lab Manual 1"]').value,
        description: document.querySelector('textarea').value,
        department: deptSelect.value,
        branch: branchSelect.value !== 'Select Branch' ? branchSelect.value : '',
        year: document.getElementById('year-select').value,
        subject: 'General',
        section: 'all',
        fileUrl: 'sample.pdf'
    };

    btn.innerHTML = 'Publishing...';
    btn.disabled = true;

    setTimeout(() => {
        LMS_DB.createAssignment(assignmentData);
        alert('Assignment Published Successfully!');
        loadRecentUploads();
        btn.innerHTML = originalText;
        btn.disabled = false;
        showSection('assignments'); // Ensure we stay/go to assignments view
        updateDashboardStats();
    }, 500);
});

function loadRecentUploads() {
    const assignments = LMS_DB.getAssignments().slice().reverse();
    const tbody = document.getElementById('recent-uploads-body');
    tbody.innerHTML = '';

    assignments.forEach(item => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';
        const row = `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${item.title}</td>
                <td class="px-6 py-4">${item.department.toUpperCase()} ${item.branch ? '(' + item.branch + ')' : ''}</td>
                <td class="px-6 py-4"><span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${item.section || 'All'}</span></td>
                <td class="px-6 py-4">${dateStr}</td>
                <td class="px-6 py-4"><span class="flex w-3 h-3 bg-green-500 rounded-full" title="Active"></span></td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// --- SETTINGS SECTION ---
function loadSettings() {
    const config = LMS_DB.getAppConfig();
    document.getElementById('conf-title').value = config.landingTitle || '';
    document.getElementById('conf-bg').value = config.landingBg || '';
    document.getElementById('conf-preview').src = config.landingBg || '';
    // document.getElementById('conf-results').checked = config.resultPublished || false; // Moved to students section

    // Also sync the checkbox in students section if it exists
    const studentCheck = document.getElementById('conf-results-student');
    if (studentCheck) studentCheck.checked = config.resultPublished || false;
}

function saveConfig() {
    const newConfig = {
        landingTitle: document.getElementById('conf-title').value,
        landingBg: document.getElementById('conf-bg').value,
        resultPublished: LMS_DB.getAppConfig().resultPublished // Keep existing unless toggled elsewhere
    };
    LMS_DB.updateAppConfig(newConfig);
    alert('Settings Saved!');
    loadSettings();
}

function toggleResultsGlobal(status) {
    const config = LMS_DB.getAppConfig();
    config.resultPublished = status;
    LMS_DB.updateAppConfig(config);
    // Silent update or optional alert?
    // alert('Results ' + (status ? 'Unlocked' : 'Locked'));
}

// Password Reset
const addUserForm = document.getElementById('addUserForm');
if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        // Defaults
        data.year = parseInt(data.year) || 1;
        // Only auto-gen avatar if not editing or explicit clear (simple check: if keeping existing, we might lose it if we overwrite. 
        // For simplicity, if editing, we keep existing avatar unless we want to regenerate. 
        // Let's assume we regenerate if name changes? No, keep it simple.
        if (!data.avatar) {
            data.avatar = `https://ui-avatars.com/api/?name=${data.name.replace(/ /g, '+')}&background=random`;
        }

        // Parse assignedSubjects
        if (data.assignedSubjects) {
            try {
                data.assignedSubjects = JSON.parse(data.assignedSubjects);
            } catch (e) {
                alert('Invalid JSON in Assigned Subjects!');
                return;
            }
        }

        let success = false;
        // Check if updating
        if (document.getElementById('edit-mode-id').value) {
            // Update
            const finalData = { ...data, id: document.getElementById('edit-mode-id').value };
            // We shouldn't change ID usually, but if we do, need to handle it. 
            // Here we rely on the hidden field for the ORIGINAL ID if we were doing strict updates, 
            // but the form has an ID input. If user changes ID, it's a "new" user or "move". 
            // For now, let's assume ID is readonly in edit mode?

            success = LMS_DB.updateUser(finalData);
            if (success) alert('User Updated!');
        } else {
            success = LMS_DB.addUser(data);
            if (success) alert('User Created Successfully!');
        }

        if (success) {
            document.getElementById('addUserModal').classList.add('hidden');
            e.target.reset();
            loadStudents();
            updateDashboardStats();
            document.getElementById('edit-mode-id').value = ''; // Clear edit mode
            document.getElementById('modal-title').innerText = 'Add New User';
            document.getElementById('btn-submit-user').innerText = 'Create User';
            document.querySelector('#addUserForm input[name="id"]').readOnly = false;
        }
    });
}

function openAddUserModal() {
    document.getElementById('addUserModal').classList.remove('hidden');
    document.getElementById('addUserForm').reset();
    document.getElementById('edit-mode-id').value = '';
    document.getElementById('modal-title').innerText = 'Add New User';
    document.getElementById('btn-submit-user').innerText = 'Create User';
    document.querySelector('#addUserForm input[name="id"]').readOnly = false;
    document.querySelector('#addUserForm input[name="password"]').required = true;
}

function editUser(userId) {
    const user = LMS_DB.getUsers().find(u => u.id === userId);
    if (!user) return;

    document.getElementById('addUserModal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = 'Edit User';
    document.getElementById('btn-submit-user').innerText = 'Update User';
    document.getElementById('edit-mode-id').value = user.id;

    // Populate Fields
    const form = document.getElementById('addUserForm');
    form.name.value = user.name;
    form.id.value = user.id;
    form.id.readOnly = true; // Cannot change ID
    form.role.value = user.role;
    form.dept.value = user.dept || '';
    form.branch.value = user.branch || '';
    form.section.value = user.section || '';
    form.year.value = user.year || '';
    form.password.value = user.password;

    if (user.assignedSubjects) {
        form.assignedSubjects.value = JSON.stringify(user.assignedSubjects);
    } else {
        form.assignedSubjects.value = '';
    }
}

// Academic Section Logic
function updateAcadBranches(type) {
    const deptId = type === 'filter' ? 'acad-filter-dept' : 'acad-add-dept';
    const branchId = type === 'filter' ? 'acad-filter-branch' : 'acad-add-branch';
    const dept = document.getElementById(deptId).value;
    const branchSelect = document.getElementById(branchId);

    branchSelect.innerHTML = type === 'filter' ? '<option value="All">All Branches</option>' : '<option value="All">All Branches</option>';

    if (branches[dept]) {
        branches[dept].forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.innerText = b;
            branchSelect.appendChild(opt);
        });
    }
}

function loadAcademicData() {
    let courses = LMS_DB.getCourses();
    const tableBody = document.getElementById('academic-table-body');
    if (!tableBody) return;

    // Filters
    const fDept = document.getElementById('acad-filter-dept').value;
    const fBranch = document.getElementById('acad-filter-branch').value;

    if (fDept !== 'All') {
        courses = courses.filter(c => c.dept === fDept);
    }
    if (fBranch !== 'All') {
        courses = courses.filter(c => c.branch === fBranch);
    }

    tableBody.innerHTML = '';
    courses.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = "border-b hover:bg-slate-50 transition-colors text-sm";
        tr.innerHTML = `
            <td class="px-6 py-4">
                <div class="font-mono font-bold text-slate-700">${c.id}</div>
                <div class="text-[10px] text-slate-400 uppercase tracking-tighter">${c.code}</div>
            </td>
            <td class="px-6 py-4 font-medium">${c.name}</td>
            <td class="px-6 py-4">
                <span class="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">${c.dept || 'N/A'}</span>
                <span class="block text-[10px] text-slate-500 mt-1">${c.branch || 'All Branches'}</span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="deleteSubject('${c.id}')" class="text-red-500 hover:text-red-700 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function deleteSubject(sid) {
    if (confirm('Are you sure? This will remove the subject from the library.')) {
        LMS_DB.deleteCourse(sid);
        loadAcademicData();
    }
}

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    const subForm = document.getElementById('addSubjectForm');
    if (subForm) {
        subForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(subForm);
            const newSub = {
                id: formData.get('id'),
                name: formData.get('name'),
                code: formData.get('code'),
                dept: formData.get('dept'),
                branch: formData.get('branch')
            };
            LMS_DB.addCourse(newSub);
            subForm.reset();
            // Reset branch dropdown
            document.getElementById('acad-add-branch').innerHTML = '<option value="All">All Branches</option>';
            loadAcademicData();
            alert('Subject added successfully!');
        };
    }
});
