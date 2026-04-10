## VoteWise 🗳️

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![React][react-shield]][react-url]
[![NodeJS][node-shield]][node-url]
[![Prisma][prisma-shield]][prisma-url]
[![SQLite][sqlite-shield]][sqlite-url]

<br />
<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2633/2633813.png" alt="Logo" width="80" height="80">

  <h3 align="center">VoteWise — Automated Election Management & Voting System</h3>

  <p align="center">
    A secure, full-stack voting platform designed for institutional elections, built with React + Vite and Node.js/Prisma.
    <br />
    <br />
    <a href="https://github.com/reymartrubio24-beep/votewise">💻 View Code</a>
    ·
    <a href="https://github.com/reymartrubio24-beep/votewise/issues">🐞 Report Bug</a>
    ·
    <a href="https://github.com/reymartrubio24-beep/votewise/issues">✨ Request Feature</a>
  </p>
</div>

---

## 📖 About The Project

**VoteWise** is a modern election management system that streamlines the voting process for schools, organizations, and small communities. It provides a secure, transparent, and easy-to-use interface for both voters and administrators, ensuring that election results are accurate and auditable.

### ✨ Key Features

- **🔐 Secure Authentication** — Multi-role login system (`Voter`, `Admin`, `Superadmin`) using student IDs and encrypted passwords.
- **🗳️ Interactive Voting** — A guided voting experience where voters can view candidate platforms and submit their choices easily.
- **📊 Admin Control Panel** — Manage the entire election lifecycle: create elections, add positions, and register candidates.
- **📈 Real-time Analytics** — Visualized election results using dynamic charts (ApexCharts) for real-time monitoring of vote counts.
- **🛡️ Integrity & Auditing** — Automated audit logs that track voting participation while maintaining voter anonymity through hashing.
- **📥 CSV Bulk Import** — Quickly populate the voter database by importing student lists from CSV files.
- **📱 Responsive Layout** — Optimized for both desktop and mobile devices to ensure every voter can participate from anywhere.
- **🌓 Modern UI** — Clean, premium interface with intuitive navigation and visual feedback.

---

### 🛠️ Built With

| Layer    | Technology                                                                        |
| -------- | --------------------------------------------------------------------------------- |
| Frontend | [React 19](https://reactjs.org/) + [Vite 8](https://vitejs.dev/)                  |
| Backend  | [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)              |
| ORM      | [Prisma](https://www.prisma.io/)                                                  |
| Database | [SQLite](https://www.sqlite.org/)                                                 |
| Charts   | [ApexCharts](https://apexcharts.com/)                                             |
| Styling  | Vanilla CSS with CSS Variables & Lucide Icons                                     |
| Tooling  | ESLint, Nodemon, Concurrently                                                     |

---

## 📂 Project Structure

```
votewise/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Shared UI components (Layout, ProtectedRoute, etc.)
│   │   ├── context/            # AuthContext for state management
│   │   ├── pages/              # Home, Dashboard, VotingPage, Results, etc.
│   │   ├── App.jsx             # Main routing configuration
│   │   └── main.jsx            # Entry point
│   └── vite.config.js          # Vite configuration
├── server/                     # Backend API (Node.js + Express)
│   ├── prisma/                 # Database schema & migrations
│   ├── src/                    # API routes and logic
│   ├── uploads/                # Candidate photos & assets
│   ├── .env                    # Environment variables
│   └── index.js                # Server entry point
├── 50voters.csv                # Sample voter data for import
├── package.json                # Root scripts (Concurrently)
└── README.md
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)

### ⚙️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/reymartrubio24-beep/votewise.git
cd votewise
```

2. **Setup the Backend:**

```bash
cd server
npm install
```

- Create a `.env` file in the `server` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
```

- Initialize the database:
```bash
npx prisma db push
```

3. **Setup the Frontend:**

```bash
cd ../client
npm install
```

4. **Start the Project:**

Return to the root directory and run:

```bash
npm run dev
```

The app will start concurrently:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 💡 Usage

### 🎯 Roles & Permissions

| Feature             | Superadmin | Admin | Voter |
| ------------------- | :--------: | :---: | :---: |
| Manage Elections    |     ✅      |  ✅   |  ❌   |
| Manage Candidates   |     ✅      |  ✅   |  ❌   |
| View Audit Logs     |     ✅      |  ✅   |  ❌   |
| Cast Vote           |     ❌      |  ❌   |  ✅   |
| View Live Results   |     ✅      |  ✅   |  ✅   |

---

## 🗺️ Roadmap

- [ ] Email notifications for voting confirmation
- [ ] Support for multiple election types (e.g., Ranked Choice)
- [ ] Advanced security with Multi-Factor Authentication (MFA)
- [ ] Export results to PDF and Excel
- [ ] Integration with school management systems
- [ ] Dark mode support

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📫 Contact

**Rey Mart Rubio** — [GitHub Profile](https://github.com/reymartrubio24-beep)

Project Link: [https://github.com/reymartrubio24-beep/votewise](https://github.com/reymartrubio24-beep/votewise)

<!-- MARKDOWN LINKS & IMAGES -->

[forks-shield]: https://img.shields.io/github/forks/reymartrubio24-beep/votewise?style=for-the-badge
[forks-url]: https://github.com/reymartrubio24-beep/votewise/network/members
[stars-shield]: https://img.shields.io/github/stars/reymartrubio24-beep/votewise?style=for-the-badge
[stars-url]: https://github.com/reymartrubio24-beep/votewise/stargazers
[issues-shield]: https://img.shields.io/github/issues/reymartrubio24-beep/votewise?style=for-the-badge
[issues-url]: https://github.com/reymartrubio24-beep/votewise/issues
[react-shield]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[prisma-shield]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[sqlite-shield]: https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://www.sqlite.org/
