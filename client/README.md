## VoteWise 🗳️

[![React][react-shield]][react-url]
[![Node.js][node-shield]][node-url]
[![Prisma][prisma-shield]][prisma-url]
[![SQLite][sqlite-shield]][sqlite-url]

<br />
<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2633/2633813.png" alt="Logo" width="80" height="80">

  <h3 align="center">VoteWise — Modern Student Government Election Portal</h3>

  <p align="center">
    A professional, secure, and responsive digital voting platform for educational institutions.
    <br />
    <br />
    <a href="#">💻 View Demo</a>
    ·
    <a href="#">🐞 Report Bug</a>
    ·
    <a href="#">✨ Request Feature</a>
  </p>
</div>

---

## 📖 About The Project

**VoteWise** is an end-to-end election management system designed to streamline student government voting. It replaces traditional paper ballots with a modern, glassmorphism-inspired digital interface that ensures integrity, transparency, and ease of use for both administrators and student voters.

### ✨ Key Features

- **🔐 Dual-Authentication System** — Specialized login portals for Administrators and Students. Students login using their **Lastname** and **School ID**.
- **📸 Candidate Photo Management** — Admins can upload, preview, and remove high-resolution photos for each candidate.
- **📦 Modular Architecture** — Clean, refactored codebase with a separate MVC-style backend and a decoupled component-based frontend.
- **📊 Admin Dashboard** — Real-time stats on registered voters, active elections, total turnout, and live vote counts.
- **📥 CSV Bulk Operations** — Import entire voter lists via CSV and export election results for official record-keeping.
- **📝 Audit & Logs** — Track all voting activity with a secure audit log system.
- **📱 Ultra-Responsive UI** — Fully optimized for mobile, tablet, and desktop viewports with a premium "Glassmorphism" aesthetic.
- **🧹 Data Management** — Tools to clear voter lists, manage specific candidates, and create complex multi-position elections.

---

### 🛠️ Built With

| Layer      | Technology                                                 |
| ---------- | ---------------------------------------------------------- |
| Frontend   | [React 19](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) |
| Backend    | [Node.js](https://nodejs.org/) (Express REST API)          |
| Database   | [SQLite](https://sqlite.org/) via [Prisma ORM](https://www.prisma.io/) |
| Styling    | Vanilla CSS3 with Modern Variables & Lucide Icons          |
| Auth       | JWT (JSON Web Tokens) & Bcrypt Password Hashing            |

---

## 📂 Project Structure

```
votewise/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # ElectionModals, CandidateModals, VoterListPanel
│   │   │   └── common/         # UIComponents (Modal, Toast)
│   │   ├── pages/              # AdminDashboard, VoterLogin, Results, VotingPage
│   │   ├── context/            # AuthContext
│   │   └── api.js              # Axios configuration & API wrapper
├── server/                     # Express Backend
│   ├── src/
│   │   ├── controllers/        # Auth, Election, Candidate, Voter logic
│   │   ├── routes/             # API endpoint definitions
│   │   ├── middleware/         # Auth & Multer setup
│   │   └── config/             # Prisma client initialization
│   ├── prisma/                 # Database schema & migrations
│   ├── uploads/                # Candidate photo storage
│   └── index.js                # Server entry point
└── README.md
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**

### ⚙️ Installation

1. **Clone & Install:**
```bash
git clone https://github.com/username/votewise.git
cd votewise
npm install
cd client && npm install
cd ../server && npm install
```

2. **Environment Setup:**
Create a `.env` file in the `server/` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=5000
```

3. **Database Migration:**
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

4. **Start Development:**
```bash
# From the root directory
npm run dev
```

---

### 🔑 Default Accounts

| Role          | Username/ID | Password   |
| ------------- | ----------- | ---------- |
| Administrator | `admin`     | `admin123` |
| Student Voter | `Smith`     | `20230001` |

---

## 🗺️ Roadmap

- [ ] Email notifications for election results
- [ ] Multi-factor authentication (MFA) for Admins
- [ ] Blockchain-inspired vote verification
- [ ] Customizable themes for different departments
- [ ] Animated results reveal dashboard

---

## 📫 Contact

Project Link: [https://github.com/username/votewise](https://github.com/username/votewise)

<!-- MARKDOWN LINKS & IMAGES -->
[react-shield]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[prisma-shield]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[sqlite-shield]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://sqlite.org/
