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

    $script = <<<'JAVASCRIPT'
/**
 * Auto-generated Google Forms Quiz Creator
 * Lesson: LESSON_TITLE_PLACEHOLDER
 * Generated on: GENERATED_DATE_PLACEHOLDER
 * 
 * Instructions:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Run the 'createQuizForms' function
 * 5. Check your Google Drive for the created forms or copy and paste the links
 */

function createQuizForms() {
  const lessonData = QUIZ_DATA_PLACEHOLDER;
  
  lessonData.quizzes.forEach((quiz, index) => {
    try {
      createSingleQuiz(quiz, index + 1);
      console.log(`Successfully created quiz: ${quiz.title}`);
    } catch (error) {
      console.error(`Error creating quiz "${quiz.title}":`, error);
    }
  });
  
  console.log(`Successfully processed ${lessonData.quizzes.length} quiz(s) for lesson: LESSON_TITLE_PLACEHOLDER`);
}

function createSingleQuiz(quizData, quizNumber) {
  // Create the form
  const form = FormApp.create(`${quizData.title} - Quiz ${quizNumber}`);
  
  // Configure form settings
  form.setDescription(`Quiz for: LESSON_TITLE_PLACEHOLDER\n\nInstructions: Please answer all questions carefully. Make sure to provide your complete information.`);
  form.setCollectEmail(true);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  form.setIsQuiz(true);
  
  // Set quiz settings for automatic grading
  form.setLimitOneResponsePerUser(true); // Only one response per student
  form.setRequireLogin(true); // Require Google account login to track users
  
  // Configure to release grades immediately after submission
  form.setPublishingSummary(true);
  form.setShowLinkToRespondAgain(false);
  
  // Add student information section
  addStudentInfoSection(form);
  
  // Add quiz questions
  quizData.questions.forEach((question, questionIndex) => {
    addQuestion(form, question, questionIndex + 1);
  });
  
  // Set up response handling
  setupResponseHandling(form, quizData);
  
  // Configure automatic grade release
  setupAutomaticGrading(form);
  
  Logger.log('Please make sure to save all of this URLS as you may never see them again.');
  Logger.log(`Created quiz: ${quizData.title}`);
  Logger.log(`Student URL: ${form.getPublishedUrl()}`);
  Logger.log(`Teacher URL: ${form.getEditUrl()}`);
  console.log('Please make sure to save all of this URLS as you may never see them again.');
  console.log(`Created quiz: ${quizData.title}`);
  console.log(`Student URL: ${form.getPublishedUrl()}`);
  console.log(`Teacher URL: ${form.getEditUrl()}`);
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
      .everyMinutes(1) // Check every minute for new submissions
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
    
    Logger.log(`Response spreadsheet: ${spreadsheet.getUrl()}`);
  } catch (error) {
    console.error('Error setting up response handling:', error);
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
      $lessonTitle,
      date('Y-m-d H:i:s'),
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
