# Aralith

**Aralith** is an AI-powered educational tool designed to transform lesson materials into quizzes tailored to specific scopes. It supports the upload of PDFs, DOCX files, images, and plain text files, utilizing AI to extract key concepts for generating diverse question types, aiding students in efficient studying and assisting educators in quick preparation.

---

## Features

- User Authentication
- Support for Uploading PDFs, DOCX, Images (OCR), and Plain Text
- AI-Driven Content Extraction and Quiz Generation
- Multiple Quiz Types
- Quiz History Tracking
- Quiz Attempt Review
- Export Quizzes to PDF or Google Forms via Apps Script
- Download Quizzes as DOCX
- Lesson Summarization
- Flashcards Based on Provided Lessons

---

## Tech Stack

| Layer             | Tools Used                            |
| ----------------- | ------------------------------------- |
| **Frontend**      | React, Inertia.js, TailwindCSS        |
| **Backend**       | Laravel (RESTful Inertia-powered API) |
| **Database**      | PostgreSQL                            |
| **AI Services**   | GroqAPI                               |
| **File Handling** | FastAPI and Laravel temporary storage |
| **Deployment**    | Render (Backend and Frontend)         |

---

## Project Structure

- `/resources/js` - React Components and Pages
- `/routes` - Laravel Web & API Routes
- `/app` - Controllers, Models, Services
- `/database` - Migrations and Seeders
- `/public` - Public Assets

---

## Installation & Usage

### 1. Clone the Repository

```bash
git clone https://github.com/kkumber/aralith.git
cd aralith
```

### 2. Request an Environment File

Contact the maintainer for an `.env` file to properly configure the environment variables.

### 3. Please install the correct versions of php and node

See the composer.json and package.json for more details

### 4. Backend Setup (Laravel)

Install all backend dependencies

```bash
composer install
```

### 5. Run Backend Commands

Create a database in PostgreSQL named 'aralith' and migrate

```bash
php artisan migrate
php artisan serve
```

### 6. Frontend Setup (React + Inertia)

Install frontend dependencies

```bash
npm install
npm run dev
```
