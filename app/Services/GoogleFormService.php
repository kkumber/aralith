<?php

namespace App\Services;

use App\Models\Lessons;
use App\Models\Quiz;
use App\Models\Question;

class GoogleFormService
{
    /**
     * Generate Google Apps Script code for creating a quiz form
     */
    public function generateAppsScript(Lessons $lesson): array
    {
        $quizzes = $lesson->quizzes()->with('questions')->get();

        if ($quizzes->isEmpty()) {
            throw new \Exception('No quizzes found for this lesson.');
        }

        $script = $this->buildAppsScript($lesson, $quizzes);

        return [
            'script' => $script,
            'instructions' => $this->getInstructions(),
            'lesson_title' => $lesson->title,
            'quiz_count' => $quizzes->count(),
            'total_questions' => $quizzes->sum(fn($quiz) => $quiz->questions->count())
        ];
    }

    /**
     * Build the complete Apps Script code
     */
    private function buildAppsScript(Lessons $lesson, $quizzes): string
    {
        $lessonTitle = addslashes($lesson->title);
        $quizData = $this->formatQuizData($quizzes);

        return <<<JAVASCRIPT
/**
 * Auto-generated Google Forms Quiz Creator
 * Lesson: {$lessonTitle}
 * Generated on: " . date('Y-m-d H:i:s') . "
 * 
 * Instructions:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Run the 'createQuizForms' function
 * 5. Check your Google Drive for the created forms
 */

function createQuizForms() {
  const lessonData = {$quizData};
  
  lessonData.quizzes.forEach((quiz, index) => {
    try {
      createSingleQuiz(quiz, index + 1);
    } catch (error) {
      console.error(`Error creating quiz "\${quiz.title}":`, error);
    }
  });
  
  console.log(`Successfully processed \${lessonData.quizzes.length} quiz for lesson: {$lessonTitle}`);
}

function createSingleQuiz(quizData, quizNumber) {
  // Create the form
  const form = FormApp.create(`\${quizData.title} - Quiz \${quizNumber}`);
  
  // Configure form settings
  form.setDescription(`Quiz for: {$lessonTitle}\\n\\nInstructions: Please answer all questions carefully. Make sure to provide your complete information.`);
  form.setCollectEmail(true);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  form.setIsQuiz(true);
  
  // Add student information section
  addStudentInfoSection(form);
  
  // Add quiz questions
  quizData.questions.forEach((question, questionIndex) => {
    addQuestion(form, question, questionIndex + 1);
  });
  
  // Set up response handling
  setupResponseHandling(form, quizData);
  
  Logger.log('Please make sure to save all of this URLS as you may never see them again.');
  Logger.log(`Created quiz: \${quizData.title}`);
  Logger.log(`Student URL: \${form.getPublishedUrl()}`);
  Logger.log(`Teacher URL: \${form.getEditUrl()}`);
  console.log('---');
}

function addStudentInfoSection(form) {
  // Add section break
  form.addSectionHeaderItem()
    .setTitle('Student Information')
    .setHelpText('Please provide your complete information below.');
  
  // Student Number
  form.addTextItem()
    .setTitle('Student Number')
    .setHelpText('Enter your student ID number')
    .setRequired(true);
  
  // Last Name
  form.addTextItem()
    .setTitle('Last Name')
    .setHelpText('Enter your last name')
    .setRequired(true);
  
  // First Name
  form.addTextItem()
    .setTitle('First Name')
    .setHelpText('Enter your given name')
    .setRequired(true);
  
  // Add section break for quiz
  form.addSectionHeaderItem()
    .setTitle('Quiz Questions')
    .setHelpText('Answer all questions below. Read each question carefully.');
}

function addQuestion(form, questionData, questionNumber) {
  const questionTitle = `Question \${questionNumber}: \${questionData.question_text}`;
  
  switch (questionData.type) {
    case 'Multiple Choice':
      addMultipleChoiceQuestion(form, questionData, questionTitle);
      break;
      
    case 'True/False':
      addTrueFalseQuestion(form, questionData, questionTitle);
      break;
      
    case 'Fill in the blank':
      addFillInBlankQuestion(form, questionData, questionTitle);
      break;
      
    case 'Identification':
      addIdentificationQuestion(form, questionData, questionTitle);
      break;
      
    case 'Multiple Answers':
      addMultipleAnswersQuestion(form, questionData, questionTitle);
      break;
      
    case 'Short Answer':
      addShortAnswerQuestion(form, questionData, questionTitle);
      break;
      
    default:
      console.warn(`Unknown question type: \${questionData.type}`);
      addShortAnswerQuestion(form, questionData, questionTitle);
  }
}

// Helper function for multiple choice questions
function addMultipleChoiceQuestion(form, questionData, title) {
  const item = form.addMultipleChoiceItem()
    .setTitle(title)
    .setRequired(true);
  
  const choices = questionData.options.map(option => {
    return item.createChoice(option);
  });
  
  item.setChoices(choices);
  
  // Set correct answer if this is a graded quiz
  if (questionData.correct_answer && questionData.correct_answer.length > 0) {
    const correctChoices = choices.filter(choice => 
      questionData.correct_answer.includes(choice.getValue())
    );
    if (correctChoices.length > 0) {
      item.setCorrectAnswer(correctChoices[0]);
    }
  }
}

// Helper function for true/false questions
function addTrueFalseQuestion(form, questionData, title) {
  const item = form.addMultipleChoiceItem()
    .setTitle(title)
    .setRequired(true);
  
  const trueChoice = item.createChoice('True');
  const falseChoice = item.createChoice('False');
  item.setChoices([trueChoice, falseChoice]);
  
  // Set correct answer
  if (questionData.correct_answer && questionData.correct_answer.length > 0) {
    const correctAnswer = questionData.correct_answer[0].toLowerCase();
    if (correctAnswer === 'True') {
      item.setCorrectAnswer(trueChoice);
    } else if (correctAnswer === 'False') {
      item.setCorrectAnswer(falseChoice);
    }
  }
}

// Helper function for fill-in-the-blank questions
function addFillInBlankQuestion(form, questionData, title) {
  const item = form.addTextItem()
    .setTitle(title)
    .setRequired(true);

    if (questionData.correct_answer && questionData.correct_answer.length > 0) {
        const correctAnswers = questionData.correct_answer.map(answer => 
            item.createResponse(answer.toString().trim())
        );
        item.setCorrectAnswers(correctAnswers);
    }
}

// Helper function for identification questions
function addIdentificationQuestion(form, questionData, title) {
  const item = form.addTextItem()
    .setTitle(title)
    .setRequired(true);

    if (questionData.correct_answer && questionData.correct_answer.length > 0) {
        const correctAnswers = questionData.correct_answer.map(answer => 
            item.createResponse(answer.toString().trim())
        );
        item.setCorrectAnswers(correctAnswers);
    }
}

// Helper function for multiple answers questions
function addMultipleAnswersQuestion(form, questionData, title) {
  const item = form.addCheckboxItem()
    .setTitle(title)
    .setRequired(true);
  
  const choices = questionData.options.map(option => {
    return item.createChoice(option);
  });
  
  item.setChoices(choices);
  
  // Set correct answers
  if (questionData.correct_answer && questionData.correct_answer.length > 0) {
    const correctChoices = choices.filter(choice => 
      questionData.correct_answer.includes(choice.getValue())
    );
    if (correctChoices.length > 0) {
      item.setCorrectAnswers(correctChoices);
    }
  }
}

// Spreadsheet to collect responses
function setupResponseHandling(form, quizData) {
  // Create a spreadsheet to collect responses
  const spreadsheet = SpreadsheetApp.create(`\${quizData.title} - Responses`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  
  
  console.log(`Response spreadsheet: \${spreadsheet.getUrl()}`);
}

// Utility function to batch create all quizzes
function createAllQuizzes() {
  createQuizForms();
}

// Function to delete all forms created by this script (use with caution)
function deleteAllCreatedForms() {
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
  let count = 0;
  
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().includes('{$lessonTitle}')) {
      console.log(`Deleting: \${file.getName()}`);
      file.setTrashed(true);
      count++;
    }
  }
  
  console.log(`Deleted \${count} form(s)`);
}
JAVASCRIPT;
    }

    /**
     * Format quiz data for JavaScript
     */
    private function formatQuizData($quizzes): string
    {
        $data = [
            'lesson_title' => $quizzes->first()->lesson->title ?? 'Unknown Lesson',
            'quizzes' => []
        ];

        foreach ($quizzes as $quiz) {
            $quizData = [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'config' => $quiz->config ?? ['is_graded' => true],
                'questions' => []
            ];

            foreach ($quiz->questions as $question) {
                $questionData = [
                    'id' => $question->id,
                    'type' => $question->type,
                    'question_text' => $question->question_text,
                    'explanation' => $question->explanation,
                    'options' => $question->options ?? [],
                    'correct_answer' => $question->correct_answer ?? []
                ];

                $quizData['questions'][] = $questionData;
            }

            $data['quizzes'][] = $quizData;
        }

        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Get setup instructions for teachers
     */
    private function getInstructions(): array
    {
        return [
            'setup' => [
                'Go to https://script.google.com',
                'Click "New Project"',
                'Replace the default code with the generated script',
                'Save the project with a meaningful name',
                'Click "Run" button and authorize the script',
                'Check your Google Drive for the created forms'
            ],
            'features' => [
                'Automatically creates Google Forms for each quiz',
                'Includes student information collection',
                'Sets up response collection in Google Sheets',
                'Configures auto-grading for supported question types',
                'Provides both form and response spreadsheet URLs'
            ],
            'notes' => [
                'Fill-in-the-blank and identification questions require manual grading',
                'Multiple choice and true/false questions are auto-graded',
                'Each form is linked to a response spreadsheet',
                'You can share the form URLs with students',
                'Forms can be edited after creation through Google Forms interface'
            ]
        ];
    }
}
