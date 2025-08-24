# Aralith

**Aralith** is an AI-powered educational tool designed to transform lesson materials into quizzes tailored to specific scopes. It supports the upload of PDFs, DOCX files, PPTX, images, and plain text, utilizing AI to extract key concepts for generating diverse question types, aiding students in efficient studying and assisting educators in quick preparation.

---

## Features

- User Authentication
- Support for Uploading PDFs, DOCX, PPTX, Images (OCR), and Plain Text
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
- `/tests` - Frontend and backend tests

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kkumber/aralith.git
cd aralith
```

### 2. Request an Environment File

Contact the maintainer for an _.env_ file to properly configure the environment variables.

### 3. Please install the correct versions of php (version 8+) and node (version 22+)

See the composer.json and package.json for more details

### 4. Laravel Setup

Install composer. You can go to the official page for instructions:

<a href="https://getcomposer.org/download/">https://getcomposer.org/download/</a>

After installing composer we can now install all backend dependencies

```bash
composer install
```

### 5. Database Setup

Make sure you have PostgreSQL installed in your system. Check the official page to see how to install on your specific operating system

<a href="https://www.postgresql.org/download/">https://www.postgresql.org/download/</a>

Create a database in PostgreSQL named **aralith** and migrate.
Make sure your pgsql configuration correctly corresponds to the Database configuration in the .env file

```bash
php artisan migrate
```

> You need to **configure the .env file to match your pgsql configuration** or vice versa

### 6. React + Inertia Setup

Install frontend dependencies

```bash
npm install
```

## Usage

You can serve locally by running both scripts

```bash
npm run dev
```

```bash
php artisan serve
```

The website is served via php artisan -> http://127.0.0.1:8000

> If you are seeing errors, make sure that both commands are running

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
