# 🎓 Invertis Learning Management System (LMS)

![Invertis LMS Banner](images/wallpaper.jpg)

A comprehensive, role-based Learning Management System built for **Invertis University**. This platform facilitates seamless interaction between students, teachers, and administrators, providing a centralized hub for academic resources, results, and campus news.

---

## 🌟 Key Features

### 👨‍🎓 Student Module
- **Dashboard**: Overview of enrolled courses and upcoming deadlines.
- **Assignments**: View and submit assignments or quizzes with ease.
- **Marksheet**: Access detailed internal marks and assignment grades.
- **Profile Management**: Update personal details and change passwords.

### 👩‍🏫 Teacher Module
- **Dashboard**: Manage assigned classes and subjects.
- **Evaluation**: Review student submissions and provide feedback/grades.
- **Course Material**: (Extendable) Upload and manage resources for students.

### 🔑 Admin Module
- **User Management**: Add, delete, or lock/unlock student and teacher accounts.
- **Performance Analytics**: Visual representation of university-wide performance data.
- **Result Control**: "Unlock for All" feature to publish results globally across the LMS.
- **Dynamic Content**: Modify the notice board, news, and events displayed on the landing page.

---

## 🛠️ Technology Stack

- **Frontend**: 
  - [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) & [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  - [Tailwind CSS](https://tailwindcss.com/) for rapid UI development and responsiveness.
  - [Google Fonts (Outfit)](https://fonts.google.com/specimen/Outfit) for modern typography.
- **Backend**: 
  - [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) for static serving and routing.
- **Data Persistence**: 
  - Browser [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) used for a simulated database experience (Client-side DB).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Invertis-LMS.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Invertis-LMS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
Wait for the console message:
`🚀 Invertis LMS Server is running! 🌐 Local: http://localhost:3000`

---

## 🔐 Default Login Credentials (Demo)

| Role | User ID | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Student** | `S001` | `password` |
| **Teacher** | `T001` | `password` |

---

## 📁 Project Structure

```text
Invertis-LMS/
├── admin/          # Admin dashboard and dashboard-specific logic
├── images/         # Static assets and UI images
├── js/             # Core logic: data-store.js (Mock DB) & dynamic-content.js
├── logins/         # Specific login redirection logic
├── student/        # Student dashboard, marksheets, and assignments
├── teacher/        # Teacher dashboard and evaluation tools
├── server.js       # Express server entry point
└── index.html      # Landing Page
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by **Divyansh Singh**
