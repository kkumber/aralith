# 📘 Aralith

**Aralith** is an AI-powered educational tool that transforms lesson materials into scope-specific quizzes. Users can upload PDFs, DOCX, images, or plain text files, and Aralith intelligently extracts key concepts to generate multiple types of questions — helping students study smarter and educators prepare faster.

---

## 🚀 Features

- 📄 Upload support for PDFs, DOCX, images (OCR), and text files
- 🧠 AI-powered content extraction and quiz generation
- 📝 Multiple Types of quizzes
- 🧍 User authentication and quiz history tracking
- 💡 Clean React interface with Inertia.js and TailwindCSS
- 🔄 Export quizzes to PDF or Google Forms (soon)

---

## 🛠 Tech Stack

| Layer             | Tools Used                            |
| ----------------- | ------------------------------------- |
| **Frontend**      | React + Inertia.js + TailwindCSS      |
| **Backend**       | Laravel (RESTful Inertia-powered API) |
| **Database**      | PostgreSQL                            |
| **AI Services**   | External APIs: Cohere, Gemini, etc.   |
| **File Handling** | Laravel’s temporary file storage      |
| **Deployment**    | Render (both backend and frontend)    |

---

## 📂 Project Structure

/resources/js → React components and pages
/routes → Laravel web & API routes
/app → Controllers, Models, Services
/database → Migrations and seeders
/public → Public assets

---

## 🧪 Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/kkumber/aralith.git
cd aralith
```

**2. Backend Setup (Laravel)**

```Windows
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

```Linux
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```

```MacOS
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

# Request an env file from me

```bash
php artisan migrate
php artisan serve
```

**3. Frontend Setup (React + Inertia)**

```bash
npm install
npm run dev
```
