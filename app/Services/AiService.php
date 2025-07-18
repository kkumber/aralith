<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class AiService
{
    public function generateQuestions(array $quizData, string $lessonData)
    {
        $systemContent = $this->createQuestionsSystemPrompt();
        $userContent = $this->combineQuizLessonContent($quizData, $lessonData);
        return $this->callAi($systemContent, $userContent);
    }

    public function callAi(string $systemContent, string $userContent)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('ai.groq.api_key'),
                'Content-Type' => 'application/json'
            ])->post(config('ai.groq.api_url'), [
                'model' => config('ai.groq.models.kimi-k2'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemContent
                    ],
                    [
                        'role' => 'user',
                        'content' => $userContent
                    ]
                ],
                /* 'response_format' => [
                    'type' => 'json_schema',
                    'json_schema' => [
                        'name' => 'questions',
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'type' => ['type' => 'string', 'enum' => ['Multiple Choice', 'True/False', 'Fill in the blank', 'Identification', 'Multiple Answers']],
                                    'question_text' => ['type' => 'string'],
                                    'explanation' => ['type' => 'string'],
                                    'options' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'correct_answer' => ['type' => 'string']
                                ],
                                'required' => ['type', 'question_text', 'correct_answer'],
                                'additionalProperties' => false,
                            ]
                        ]
                    ]
                ] */
            ])->throw();

            return $response->json()['choices'][0]['message']['content'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error: ' . $e->getMessage()];
        };
    }

    public function combineQuizLessonContent(array $quizData, string $lessonData): string
    {
        return 'Quiz configuration: ' . json_encode($quizData) . '\n Lesson content: ' . $lessonData . '.';
    }

    public function createQuestionsSystemPrompt(): string
    {
        return 'You are QuizMasterAI, a professional quiz maker that only answers in JSON with the specific schema given that transforms lesson content into quiz questions based on the quiz configuration:

        CRITICAL RULES:
        - Generate questions ONLY from provided lesson content
        - NO external knowledge or hallucination
        - Return ONLY valid JSON
        - Quality over quantity - adjust count if insufficient content
        - **Only** return texts with no escape sequences.
        - You can return your JSON as one line only. DO NOT ATTEMPT TO FORMAT.
        - Make sure to only generate questions based on the requested quiz configuration and lesson content.

        INPUT: Quiz config + lesson content
        OUTPUT: JSON array of questions

        QUESTION TYPES & STRUCTURE:
        - Multiple Choice: 4 options, 1 correct (string). Ex."The dog".
        - True/False: ["True", "False"], 1 correct (string)  
        - Fill in the blank: ["The quick brown fox"] options, 1 correct (string)
        - Identification: ["bag"] options, 1 correct (string)
        - Multiple Answers: 5 options, 2-3 correct (array). Example correct answers ["Apple", "Dog"]

        DIFFICULTY:
        - Easy: basic recall
        - Medium: application/analysis  
        - Hard: synthesis/evaluation

        DISTRIBUTION:
        - "Mixed": distribute equally among all types
        - Specific types: distribute among specified types
        - If random_order=true: shuffle final array
        - If random_order=false: group by type

        SUCCESS FORMAT:
        questions: [
        {
            "type": "Multiple Choice",
            "question_text": "Question based on lesson?",
            "explanation": "Lesson states that...",
            "options": ["The independence", "Boar", "Cat", "Dog"],
            "correct_answer": "Dog"
        }
        ]

        Generate questions now. Make sure to **only** return the success JSON format.';
    }



    /* 
    return "You are QuizMasterAI, an expert at transforming lesson content into accurate, well-structured quiz questions.

        CRITICAL RULES:
        - Generate questions ONLY from the provided lesson content
        - DO NOT hallucinate or add external knowledge
        - DO NOT create questions about topics not covered in the lesson
        - Follow the exact JSON structure specified
        - Return ONLY valid JSON, no markdown or explanations

        ERROR HANDLING REQUIREMENTS:
        Before generating questions, analyze the lesson content and request:

        1. INSUFFICIENT CONTENT ANALYSIS:
        - Count distinct concepts/topics in the lesson
        - Estimate maximum quality questions possible
        - If requested questions > available content concepts: adjust downward

        2. CONTENT QUALITY REQUIREMENTS:
        - Each question must reference specific lesson content
        - Don't repeat the same concept in multiple questions
        - Ensure question difficulty matches available detail level
        - If lesson lacks depth for requested difficulty: generate what's appropriate

        3. FALLBACK STRATEGIES:
        - If lesson is too short: focus on key terms and basic concepts
        - If too many questions requested: prioritize most important concepts
        - If Mixed types requested but content supports only certain types: adjust distribution
        - Never pad with generic/external knowledge questions

        EXAMPLES OF ERROR SCENARIOS:

        Scenario 1 - Short lesson, too many questions requested:
        Input: 50-word lesson, 10 questions requested
        Response: Generate 2-3 quality questions, return partial_generation status

        Scenario 2 - Lesson lacks depth for difficulty:
        Input: Basic lesson, \"hard\" difficulty requested
        Response: Generate questions at appropriate difficulty level, note adjustment

        Scenario 3 - Limited concept diversity:
        Input: Lesson about single concept, 8 questions requested  
        Response: Generate 3-4 varied questions about that concept, avoid repetition

        Scenario 4 - Content supports only certain question types:
        Input: Factual lesson, multiple question types requested
        Response: Adjust type distribution based on content nature

        SUCCESS CRITERIA:
        - Every question must be answerable from lesson content
        - No generic knowledge questions
        - Quality over quantity always
        - Clear error communication when needed

        INPUT FORMAT:
        Expected quiz configuration structure:
        {
        \"title\": \"string, max 50 chars\",
        \"config\": {
            \"question_types\": [\"Multiple Choice\", \"True/False\", \"Fill in the blank\", \"Identification\", \"Multiple Answers\", \"Mixed\"],
            \"difficulty\": \"easy\"|\"medium\"|\"hard\",
            \"total_number_of_questions\": \"integer > 0\",
            \"random_order\": true|false
        }
        }

        LESSON CONTENT:
        {$lessonData}

        QUIZ CONFIGURATION:
        {$quizConfigJson}

        TASK REQUIREMENTS:
        1. VALIDATION: Ensure all inputs match expected format
        2. QUESTION GENERATION:
        - ATTEMPT to create {$quizData['config']['total_number_of_questions']} questions
        - If insufficient content: generate maximum possible and use partial_generation format
        - Base ALL questions on lesson content only
        - Use difficulty level: {$quizData['config']['difficulty']}
        
        3. QUESTION TYPE DISTRIBUTION:
        - If question_types contains \"Mixed\": distribute among all supported types as equally as possible
        - If specific types provided: distribute among specified types as equally as possible
        - For uneven distribution: prioritize in order provided
        - Supported types: Multiple Choice, True/False, Fill in the blank, Identification, Multiple Answers

        4. QUESTION STRUCTURE:
        For each question, provide:
        - type: exact string from question_types
        - question_text: clear, unambiguous question matching difficulty
        - explanation: concise justification for correct answer
        - options: array based on question type (see below)
        - correct_answer: string or array based on question type

        5. OPTIONS ARRAY RULES:
        - Multiple Choice: exactly 4 plausible options (strings), one correct
        - True/False: exactly [\"True\", \"False\"]
        - Fill in the blank: empty array []
        - Identification: empty array []
        - Multiple Answers: exactly 5 options, 2-3 correct answers

        6. CORRECT_ANSWER RULES:
        - Multiple Choice, True/False, Fill in the blank, Identification: single string
        - Multiple Answers: array of strings (all correct options)

        7. DIFFICULTY GUIDELINES:
        - easy: basic recall, simple concepts
        - medium: application, analysis of concepts
        - hard: synthesis, evaluation, complex reasoning

        8. FINAL STEPS:
        - If random_order is true: shuffle final question array
        - If random_order is false: group the questions by the types

        OUTPUT FORMATS:

        FOR SUCCESSFUL GENERATION:
        Return ONLY the questions array:
        [
        {
            \"type\": \"Multiple Choice\",
            \"question_text\": \"What is the main concept discussed?\",
            \"explanation\": \"The lesson explicitly states that...\",
            \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],
            \"correct_answer\": \"Option A\"
        }
        ]

        FOR PARTIAL GENERATION:
        {
        \"status\": \"partial_generation\",
        \"message\": \"Lesson content can only support X quality questions. Generated maximum possible.\",
        \"requested_count\": {$quizData['config']['total_number_of_questions']},
        \"generated_count\": X,
        \"reason\": \"insufficient_content|too_short|limited_concepts\",
        \"questions\": [
            {
            \"type\": \"Multiple Choice\",
            \"question_text\": \"...\",
            \"explanation\": \"...\",
            \"options\": [...],
            \"correct_answer\": \"...\"
            }
        ]
        }

        QUALITY CHECKS:
        - All questions must be answerable from lesson content
        - Options must be plausible and relevant
        - Explanations must reference lesson content
        - No duplicate questions
        - Correct answer must always be in options array (for applicable types)

        Generate the JSON now:";

    */
}
