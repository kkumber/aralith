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
    if (empty($lesson->title)) {
      throw new \Exception('Lesson title cannot be empty');
    }
    $lessonTitle = json_encode($lesson->title, JSON_UNESCAPED_UNICODE);
    $lessonTitle = trim($lessonTitle, '"');

    $quizData = $this->formatQuizData($quizzes);
    if ($quizData === false) {
      throw new \Exception('Failed to encode quiz data: ' . json_last_error_msg());
    }

    $script = <<<'JAVASCRIPT'
/**
 * Auto-generated Google Forms Quiz Creator
 * Lesson: LESSON_TITLE_PLACEHOLDER
 * Generated on: GENERATED_DATE_PLACEHOLDER
 */

function createQuizForms() {
  console.log('Starting Quiz Generation...');
  console.log(`Lesson: "LESSON_TITLE_PLACEHOLDER"`);
  console.log('');
  
  const lessonData = QUIZ_DATA_PLACEHOLDER;
  
  lessonData.quizzes.forEach((quiz, index) => {
    try {
      createSingleQuiz(quiz, index + 1);
      console.log(`✅ Quiz "${quiz.title}" created successfully\n`);
    } catch (error) {
      console.log(`❌ Error creating quiz "${quiz.title}": ${error.message}\n`);
    }
  });
  
  console.log('Generation complete!');
}

function createSingleQuiz(quizData, quizNumber) {
  console.log(`Creating Quiz "${quizData.title}"`);
  
  // Create the form
  const form = FormApp.create(`${quizData.title} - Quiz ${quizNumber}`);
  
  // Configure form settings
  form.setDescription(`Quiz for: LESSON_TITLE_PLACEHOLDER\n\nInstructions: Please answer all questions carefully. Make sure to provide your complete information.`);
  form.setCollectEmail(true);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  form.setIsQuiz(true);
  
  // Set quiz settings for automatic grading
  form.setLimitOneResponsePerUser(true);
  
  // Configure to release grades immediately after submission
  form.setPublishingSummary(true);
  form.setShowLinkToRespondAgain(false);
  
  // Add student information section
  addStudentInfoSection(form);
  
  // Check for manual grading questions and display their correct answers
  const manualGradingQuestions = quizData.questions.filter(q => 
    q.type === 'Fill in the blank' || 
    q.type === 'Identification' || 
    q.type === 'Short Answer'
  );
  
  if (manualGradingQuestions.length > 0) {
    console.log(`\n⚠️  MANUAL GRADING REQUIRED for ${manualGradingQuestions.length} question(s):`);
    manualGradingQuestions.forEach((question, index) => {
      const questionNum = quizData.questions.indexOf(question) + 1;
      console.log(`   Q${questionNum} (${question.type}): ${question.question_text}`);
      if (question.correct_answer && question.correct_answer.length > 0) {
        const answers = Array.isArray(question.correct_answer) 
          ? question.correct_answer.join(', ') 
          : question.correct_answer;
        console.log(`       Answer: ${answers}`);
      }
    });
  }
  // Add quiz questions
  quizData.questions.forEach((question, questionIndex) => {
    addQuestion(form, question, questionIndex + 1);
  });
  
  // Set up response handling
  setupResponseHandling(form, quizData);
  
  console.log('\n📌 IMPORTANT URLS (Save these now):');
  console.log(`Student URL: ${form.getPublishedUrl()}`);
  console.log(`Teacher URL: ${form.getEditUrl()}`);
  
  // Also log to Google Apps Script Logger for persistence
  Logger.log(`Quiz: ${quizData.title}`);
  Logger.log(`Student URL: ${form.getPublishedUrl()}`);
  Logger.log(`Teacher URL: ${form.getEditUrl()}`);
}

// Helper functions for counting question types
function countAutoGradedQuestions(questions) {
  return questions.filter(q => 
    q.type === 'Multiple Choice' || 
    q.type === 'True/False' || 
    q.type === 'Multiple Answers'
  ).length;
}

function countManualGradingQuestions(questions) {
  return questions.filter(q => 
    q.type === 'Fill in the blank' || 
    q.type === 'Identification' || 
    q.type === 'Short Answer'
  ).length;
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
  const questionTitle = `Question ${questionNumber}: ${questionData.question_text}`;
  
  try {
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
        console.warn(`Unknown question type: ${questionData.type}`);
        addShortAnswerQuestion(form, questionData, questionTitle);
    }
  } catch (error) {
    console.error(`Error adding question ${questionNumber}:`, error);
    // Add as short answer question as fallback
    addShortAnswerQuestion(form, questionData, questionTitle);
  }
}

// Helper function for multiple choice questions
function addMultipleChoiceQuestion(form, questionData, title) {
  const item = form.addMultipleChoiceItem()
    .setTitle(title)
    .setRequired(true)
    .setPoints(1); // Set 1 point per question
  
  // Ensure correct_answer is an array or single value
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];
  
  const choices = questionData.options.map(option => {
    // Use createChoice with isCorrect parameter
    const isCorrect = correctAnswers.includes(option);
    return item.createChoice(option, isCorrect);
  });
  
  item.setChoices(choices);
}

// Helper function for true/false questions
function addTrueFalseQuestion(form, questionData, title) {
  const item = form.addMultipleChoiceItem()
    .setTitle(title)
    .setRequired(true)
    .setPoints(1); // Set 1 point per question
  
  // Ensure correct_answer is an array or single value
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];
  
  let trueChoice, falseChoice;
  
  // Set correct answer
  if (correctAnswers.length > 0) {
    const correctAnswer = correctAnswers[0].toString().toLowerCase();
    if (correctAnswer === 'true') {
      trueChoice = item.createChoice('True', true);
      falseChoice = item.createChoice('False', false);
    } else if (correctAnswer === 'false') {
      trueChoice = item.createChoice('True', false);
      falseChoice = item.createChoice('False', true);
    } else {
      // Default if no clear answer
      trueChoice = item.createChoice('True', false);
      falseChoice = item.createChoice('False', false);
    }
  } else {
    // Default if no correct answer specified
    trueChoice = item.createChoice('True', false);
    falseChoice = item.createChoice('False', false);
  }
  
  item.setChoices([trueChoice, falseChoice]);
}

// Helper function for fill-in-the-blank questions
function addFillInBlankQuestion(form, questionData, title) {
  const item = form.addTextItem()
    .setTitle(title)
    .setRequired(true);

  // For text items, we can add the correct answer as help text for reference
  // Google Forms doesn't support auto-grading of text responses via Apps Script
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];
}

// Helper function for identification questions
function addIdentificationQuestion(form, questionData, title) {
  const item = form.addTextItem()
    .setTitle(title)
    .setRequired(true);

  // For identification questions, add correct answer as help text for manual grading reference
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];

}

// Helper function for multiple answers questions
function addMultipleAnswersQuestion(form, questionData, title) {
  const item = form.addCheckboxItem()
    .setTitle(title)
    .setRequired(true)
    .setPoints(1); // Set 1 point per question
  
  // Ensure correct_answer is an array
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];
  
  const choices = questionData.options.map(option => {
    // Use createChoice with isCorrect parameter for checkbox items
    const isCorrect = correctAnswers.includes(option);
    return item.createChoice(option, isCorrect);
  });
  
  item.setChoices(choices);
}

// Helper function for short answer questions
function addShortAnswerQuestion(form, questionData, title) {
  const item = form.addParagraphTextItem()
    .setTitle(title)
    .setRequired(true);

  // For short answer questions, add correct answer as help text for manual grading reference
  const correctAnswers = Array.isArray(questionData.correct_answer) 
    ? questionData.correct_answer 
    : questionData.correct_answer ? [questionData.correct_answer] : [];
}

// Configure automatic grading and grade release
function setupAutomaticGrading(form) {
  try {
    // Set up a trigger to automatically release grades when form is submitted
    ScriptApp.newTrigger('onFormSubmit')
      .timeBased()
      .everyMinutes(1)
      .create();
      
    console.log('Automatic grading trigger set up successfully');
  } catch (error) {
    console.error('Error setting up automatic grading:', error);
  }
}

// Function to handle automatic grade release (triggered function)
function onFormSubmit() {
  try {
    // Get all forms created by this script
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
    
    while (files.hasNext()) {
      const file = files.next();
      if (file.getName().includes('LESSON_TITLE_PLACEHOLDER')) {
        const form = FormApp.openById(file.getId());
        
        // Get all responses
        const responses = form.getResponses();
        
        responses.forEach(response => {
          // Check if this response has been graded
          if (response.getGradableItemResponses().length > 0) {
            // Submit grades for this response
            response.submitGrades();
            console.log(`Grades submitted for response: ${response.getId()}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error in automatic grading:', error);
  }
}

// Spreadsheet to collect responses
function setupResponseHandling(form, quizData) {
  try {
    // Create a spreadsheet to collect responses
    const spreadsheet = SpreadsheetApp.create(`${quizData.title} - Responses`);
    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
    
    console.log(`📊 Response spreadsheet created: ${spreadsheet.getUrl()}`);
    Logger.log(`Response spreadsheet: ${spreadsheet.getUrl()}`);
  } catch (error) {
    console.log(`❌ Error setting up response spreadsheet: ${error.message}`);
    console.log('   Responses will still be collected in Google Forms');
  }
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
    if (file.getName().includes('LESSON_TITLE_PLACEHOLDER')) {
      console.log(`Deleting: ${file.getName()}`);
      file.setTrashed(true);
      count++;
    }
  }
  
  console.log(`Deleted ${count} form(s)`);
}
JAVASCRIPT;

    // replace the placeholders with actual data
    $script = str_replace([
      'LESSON_TITLE_PLACEHOLDER',
      'GENERATED_DATE_PLACEHOLDER',
      'QUIZ_DATA_PLACEHOLDER'
    ], [
      json_encode($lessonTitle, JSON_UNESCAPED_UNICODE),
      json_encode(date('Y-m-d H:i:s')),
      $quizData
    ], $script);

    return $script;
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

    $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($jsonData === false) {
      throw new \Exception('Failed to encode quiz data to JSON: ' . json_last_error_msg());
    }
    return $jsonData;
  }

  // Remove or replace problematic characters
  private function sanitizeForJavaScript($text): string
  {
    $text = preg_replace('/[\r\n\t]/', ' ', $text);
    $text = preg_replace('/[^\p{L}\p{N}\s\-_()]/u', '', $text);
    return trim($text);
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
        'Provides both form and response spreadsheet URLs',
        'Limits one response per user (requires Google login)',
        'Sets 1 point per question for automatic scoring',
        'Releases grades immediately after submission'
      ],
      'notes' => [
        'Fill-in-the-blank and identification questions DOES NOT support auto-grading',
        'Multiple choice and true/false questions are auto-graded',
        'Each form is linked to a response spreadsheet',
        'You can share the form URLs with students',
        'Forms can be edited after creation through Google Forms interface'
      ]
    ];
  }
}
