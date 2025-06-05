<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>Aralith | AI Quiz Generator</title>
  @vite(['resources/css/app.css'])

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  {{-- Google font --}}
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>

<body class="grid gap-40 m-auto dark:bg-dark-background max-w-screen-lg w-full p-4">
  <header class="flex flex-col gap-4 items-center justify-center text-center md:p-20">
    <div className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
      <nav class="flex items-center justify-end gap-4">
        @guest
            <a
                href="{{ route('login') }}"
                class="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
            >
                Log in
            </a>
            <a
                href="{{ route('register') }}"
                class="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
                Register
            </a>
        @endguest
      </nav>
    </div>
    <p class="text-secondary-green font-semibold">Aralith</p>
    <h1 class="font-extrabold text-6xl">Optimize Learning with AI</h1>
    <p class="text-text-primary dark:text-dark-text-primary text-center">
      From PDFs to flashcards in a click—Aralith streamlines quiz creation so learners and educators can focus on what matters.
    </p>
    <button class="px-8 py-2 bg-primary-green text-white font-medium rounded-full w-max hover:bg-secondary-green hover:cursor-pointer transition-all duration-300 ease-out hover:shadow-lg flex items-center gap-2">
      Get Started
      <i data-lucide="arrow-right" class="w-5 h-5"></i>
    </button>
  </header>

  <main class="gap-40 grid">
    <h2 class="text-center text-5xl">Personalized Learning</h2>

    <!-- AI-Powered Quiz Generation -->
    <div class="flex flex-col md:grid md:grid-cols-2 gap-28 items-center">
      <div class="grid gap-8"> 
        <div>
          <p class="text-secondary-green font-semibold">From Files to Quizzes - Instantly</p>
          <h2>AI-Powered Quiz Generation</h2>
        </div>
        <p>Automatically turn lesson materials into tailored quizzes in seconds using AI</p>
        <ul class="flex flex-col gap-4">
          <li class="flex items-start gap-2">
            <span data-lucide="file-text" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Generate quizzes from various file types:</strong>
              <p>
                Upload PDFs, DOCX, slides, images, and more to instantly create customized quizzes that align with your study materials.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="video" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>YouTube/video analysis with auto-transcription:</strong>
              <p>
                Input video links or files, and Aralith will transcribe and analyze the content to generate relevant quiz questions.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="list" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Multiple question types:</strong>
              <p>
                Create diverse quizzes featuring multiple-choice, true/false, fill-in-the-blank, and other question formats to enhance engagement and retention.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <img src="" alt="Sample">
      </div>
    </div>

    <!-- Smart Study Tools -->
    <div class="flex flex-col md:grid md:grid-cols-2 gap-28 items-center">
      <div class="grid gap-8">
        <div>
          <p class="text-secondary-green font-semibold">Personalized Study Aids</p>
          <h2>Smart Study Tools</h2>
        </div>
        <p>Go beyond quizzes — Aralith enhances your study sessions with tools that adapt to your learning style.</p>
        <ul class="flex flex-col gap-4">
          <li class="flex items-start gap-2">
            <span data-lucide="book-open" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Flashcard generator from uploaded content:</strong>
              <p>
                Automatically convert your study materials into flashcards to reinforce learning through active recall.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="file-text" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Lesson Summaries:</strong>
              <p>
                Receive concise summaries of your materials, highlighting key points to streamline your revision process.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="message-circle" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>AI-generated feedback and explanations:</strong>
              <p>
                Gain insights into your performance with detailed feedback and explanations for each quiz question.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <img src="" alt="Sample">
      </div>
    </div>

    <!-- Progress Tracking & Analytics -->
    <div class="flex flex-col md:grid md:grid-cols-2 gap-28 items-center">
      <div class="grid gap-8">
        <div>
          <p class="text-secondary-green font-semibold">Data-Driven Insights</p>
          <h2>Progress Tracking & Analytics</h2>
        </div>
        <p>Visualize performance, track improvements, and focus on areas that need attention.</p>
        <ul class="flex flex-col gap-4">
          <li class="flex items-start gap-2">
            <span data-lucide="bar-chart-2" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Mastery tracking and skill breakdowns:</strong>
              <p>
                Monitor your understanding of different topics and identify areas that require further study.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="trending-up" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Feedback on strengths and weaknesses:</strong>
              <p>
                Receive personalized feedback highlighting your strong points and areas for improvement.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span data-lucide="history" class="w-10 text-primary-green"></span>
            <div class="font-paragraph text-text-primary dark:text-dark-text-primary">
              <strong>Quiz result history and trends:</strong>
              <p>
                Access a comprehensive history of your quiz performances to track progress over time.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <img src="" alt="Sample">
      </div>
    </div>

    <h2 class="text-center text-5xl">Who is it for?</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Students Card -->
      <div class="flex flex-col justify-between p-6 rounded-lg shadow-lg border-[1px] border-light-border dark:border-dark-border">
        <div class="flex items-center gap-3 mb-4">
          <span data-lucide="graduation-cap" class="w-6 h-6 text-primary-green"></span>
          <h3 class="text-lg font-semibold">Students</h3>
        </div>
        <p class="mb-6">
          Struggling to prepare for quizzes or exams? Aralith saves you hours by turning your class notes, PDFs, and even videos into personalized quizzes and flashcards — instantly. Focus on what matters most and retain more in less time.
        </p>
        <a href="/login" class="text-primary-green hover:text-secondary-green font-semibold flex items-center gap-1">
          Get Started
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>

      <!-- Educators Card -->
      <div class="flex flex-col justify-between p-6 rounded-lg shadow-lg border-[1px] border-light-border dark:border-dark-border">
        <div class="flex items-center gap-3 mb-4">
          <span data-lucide="presentation" class="w-6 h-6 text-primary-green"></span>
          <h3 class="text-lg font-semibold">Educators</h3>
        </div>
        <p class="mb-6">
          Designing assessments takes time — Aralith gives it back to you. Whether you teach online or in person, generate high-quality quizzes from your materials in seconds, share them with students, and track learning outcomes effortlessly.
        </p>
        <a href="/login" class="text-primary-green hover:text-secondary-green font-semibold flex items-center gap-1">
          Get Started
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>

      <!-- Lifelong Learners Card -->
      <div class="flex flex-col justify-between p-6 rounded-lg shadow-lg border-[1px] border-light-border dark:border-dark-border">
        <div class="flex items-center gap-3 mb-4">
          <span data-lucide="book-open" class="w-6 h-6 text-primary-green"></span>
          <h3 class="text-lg font-semibold">Lifelong Learners</h3>
        </div>
        <p class="mb-6">
          Learning something new or reviewing for board exams? Upload any resource — books, videos, presentations — and Aralith will create engaging, memory-boosting quizzes and study aids tailored just for you.
        </p>
        <a href="/login" class="text-primary-green hover:text-secondary-green font-semibold flex items-center gap-1">
          Get Started
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    </div>

      <!-- FAQs Section -->
  <section id="faqs" class="px-4 md:px-0">
    <h2 class="text-center text-5xl mb-12">Frequently Asked Questions</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- FAQ Item -->
      <div class="border-[1px] border-light-border dark:border-dark-border rounded-lg shadow-lg p-6">
        <button class="w-full flex justify-between items-center hover:cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i[data-state]').dataset.state = this.querySelector('i[data-state]').dataset.state === 'open' ? 'closed' : 'open'">
          <p class="font-semibold text-lg">How do I upload my files?</p>
          <i data-lucide="chevron-down" data-state="closed" class="w-6 h-6 transition-transform duration-200 text-primary-green"></i>
        </button>
        <p class="mt-4 text-text-primary dark:text-dark-text-primary hidden">
          Simply click “Get Started” → upload your PDF, DOCX, image, or video link → and let Aralith analyze it.
        </p>
      </div>
      <!-- FAQ Item -->
      <div class="border-[1px] border-light-border dark:border-dark-border rounded-lg shadow-lg p-6">
        <button class="w-full flex justify-between items-center hover:cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i[data-state]').dataset.state = this.querySelector('i[data-state]').dataset.state === 'open' ? 'closed' : 'open'">
          <p class="font-semibold text-lg">What question types are supported?</p>
          <i data-lucide="chevron-down" data-state="closed" class="w-6 h-6 transition-transform duration-200 text-primary-green"></i>
        </button>
        <p class="mt-4 text-text-primary dark:text-dark-text-primary hidden">
          Multiple-choice, true/false, fill-in-the-blank, and more—you decide which format best suits your needs.
        </p>
      </div>
      <!-- FAQ Item -->
      <div class="border-[1px] border-light-border dark:border-dark-border rounded-lg shadow-lg p-6">
        <button class="w-full flex justify-between items-center hover:cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i[data-state]').dataset.state = this.querySelector('i[data-state]').dataset.state === 'open' ? 'closed' : 'open'">
          <p class="font-semibold text-lg">Can I track quiz performance?</p>
          <i data-lucide="chevron-down" data-state="closed" class="w-6 h-6 transition-transform duration-200 text-primary-green"></i>
        </button>
        <p class="mt-4 text-text-primary dark:text-dark-text-primary hidden">
          Yes—after each quiz, Aralith provides detailed analytics on mastery, strengths, and areas for improvement.
        </p>
      </div>
      <!-- FAQ Item -->
      <div class="border-[1px] border-light-border dark:border-dark-border rounded-lg shadow-lg p-6">
        <button class="w-full flex justify-between items-center hover:cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i[data-state]').dataset.state = this.querySelector('i[data-state]').dataset.state === 'open' ? 'closed' : 'open'">
          <p class="font-semibold text-lg">Is Aralith free?</p>
          <i data-lucide="chevron-down" data-state="closed" class="w-6 h-6 transition-transform duration-200 text-primary-green "></i>
        </button>
        <p class="mt-4 text-text-primary dark:text-dark-text-primary hidden">
          Yes. Aralith is free and will always be free.
        </p>
      </div>
    </div>
  </section>

  </main>

  <!-- Footer -->
  <footer class="border-t border-light-border dark:border-dark-border mt-20 py-8">
    <div class="container mx-auto px-4 text-center text-gray-600 dark:text-dark-text-secondary">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-lg font-semibold text-primary-green">Aralith</div>
        <div class="space-x-6">
          <a href="#" class="hover:text-primary-green transition-colors">About</a>
          <a href="#" class="hover:text-primary-green transition-colors">Features</a>
          <a href="#" class="hover:text-primary-green transition-colors">FAQs</a>
          <a href="#" class="hover:text-primary-green transition-colors">Contact</a>
        </div>
        <button onclick="toggleDarkMode()" class="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border transition-colors hover:cursor-pointer">
          <i data-lucide="moon" class="w-5 h-5 dark:hidden"></i>
          <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
        </button>
      </div>
      <p class="mt-6 text-sm">© 2024 Aralith. All rights reserved.</p>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    // Dark mode toggle
    function toggleDarkMode() {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    }

    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  </script>
</body>
</html>
