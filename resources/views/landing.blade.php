<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Aralith | AI Quiz Generator</title>
    @vite(['resources/css/app.css'])


</head>
<body class="grid gap-20">
    <header class="flex flex-col gap-4 items-center justify-center text-center">
            <p class="text-secondary-green font-semibold">Aralith</p>
            <h1>Optimize Learning with AI</h1>
            <p>Built for learners and educators, Aralith is quick and easy to use to remove the fatigue in making quizzes or reviewers</p>
            <button class="px-8 py-2 bg-primary-green text-white dark:text-black font-medium rounded-full w-max hover:bg-secondary-green hover:cursor-pointer transition-all duration-300 ease-out hover:shadow-lg">Get Started</button>
    </header>

    <main class="gap-20 grid">
        <h2 class="text-center">Personalized Learning</h2>

        <div class="flex flex-col md:grid md:grid-cols-2 gap-4 items-center">
            <div class="grid gap-4">
                <div class="">
                    <p class="text-secondary-green font-semibold">From Files to Quizzes - Instantly</p>
                    <h2 class="">AI-Powered Quiz Generation</h2>
                </div>
                <p>Automatically turn lesson materials into tailored quizzes in seconds using AI</p>
                <ul class="flex flex-col gap-4">
                    <li>Generate quizzes from PDFs, DOCX, slides, images, and more</li>
                    <li>YouTube/video analysis with auto-transcription</li>
                    <li>Multiple question types (MCQ, T/F, Fill-in-the-blank, etc.)</li>
                </ul>
            </div>
            <div class="">
                <img src="" alt="Sample">
            </div>
        </div>

        <div class="flex flex-col md:grid md:grid-cols-2 gap-4 items-center">
            <div class="grid gap-4">
                <div class="">
                    <p class="text-secondary-green font-semibold">Personalized Study Aids</p>
                    <h2 class="">Smart Study Tools</h2>
                </div>
                <p>Go beyond quizzes — Aralith enhances your study sessions with tools that adapt to your learning style.</p>
                <ul class="flex flex-col gap-4">
                    <li>Flashcard generator from uploaded content</li>
                    <li>Lesson Summaries</li>
                    <li>AI-generated feedback and explanations</li>
                </ul>
            </div>
            <div class="">
                <img src="" alt="Sample">
            </div>
        </div>

        <div class="flex flex-col md:grid md:grid-cols-2 gap-4 items-center">
            <div class="grid gap-4">
                <div class="">
                    <p class="text-secondary-green font-semibold">Data-Driven Insights</p>
                    <h2 class="">Progress Tracking & Analytics</h2>
                </div>
                <p>Visualize performance, track improvements, and focus on areas that need attention.</p>
                <ul class="flex flex-col gap-4">
                    <li>Mastery tracking and skill breakdowns</li>
                    <li>Feedback on strengths and weaknesses</li>
                    <li>Quiz result history and trends</li>
                </ul>
            </div>
            <div class="">
                <img src="" alt="Sample">
            </div>
        </div>


        <h2 class="text-center">Who is it for?</h2>

        <div class="flex flex-col md:grid md:grid-cols-3 gap-12">
            <div class="">
                <h3 class="font-semibold">Students</h3>
                <p>Struggling to prepare for quizzes or exams? Aralith saves you hours by turning your class notes, PDFs, and even videos into personalized quizzes and flashcards — instantly. Focus on what matters most and retain more in less time.</p>
                <a :href="route('login')" class="text-primary-green font-semibold">Get Started -></a>
            </div>
            <div class="">
                <h3 class="font-semibold">Educators</h3>
                <p>Designing assessments takes time — Aralith gives it back to you. Whether you teach online or in person, generate high-quality quizzes from your materials in seconds, share them with students, and track learning outcomes effortlessly.</p>
                <a :href="route('login')" class="text-primary-green font-semibold">Get Started -></a>
            </div>
            <div class="">
                <h3 class="font-semibold">Lifelong Learners</h3>
                <p>Learning something new or reviewing for board exams? Upload any resource — books, videos, presentations — and Aralith will create engaging, memory-boosting quizzes and study aids tailored just for you.</p>
                <a :href="route('login')" class="text-primary-green font-semibold">Get Started -></a>
            </div>
        </div>
    </main>

    <footer>
        All Rights Reserved. Aralith.
    </footer>
</body>
</html>