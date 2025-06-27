export interface Configuration {
    question_types: string[];
    difficulty: string;
    total_number_of_questions: number;
    random_order: boolean;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'Multiple Choice' | 'True/False' | 'Multiple Answers' | 'Identification' | 'Fill in the blank' | 'Mixed' | string;

export const defaultAcceptedTypes: string[] = ['.pdf', '.docx', '.pptx', '.png', '.jpg', '.jpeg', '.webp']
export const defaultMaxFileSize: number = 5;
export const difficultyLevels: Difficulty[] = ['Easy', 'Medium', 'Hard'];
export const wordCountLimit = 1000;

export const presets = [
    { type: 'Multiple Choice', selected: false, title: 'Vocabulary Drill', description: 'Multiple choice · 10 questions', numOfQuestions: 10 },
    { type: 'True/False', selected: false, title: 'True/False Review', description: 'True/False · 12 questions', numOfQuestions: 12 },
    { type: 'Multiple Answers', selected: false, title: 'Concept Check', description: 'Multiple Answers · 6 questions', numOfQuestions: 6 },
    { type: 'Identification', selected: false, title: 'What is it?', description: 'Identification · 10 questions', numOfQuestions: 10 },
    { type: 'Fill in the blank', selected: false, title: 'Quick Recall', description: 'Fill in the blank · 10 questions', numOfQuestions: 10 },
    {
        type: 'Mixed',
        selected: false,
        title: 'Mixed Practice',
        description: 'MCQ, True/False, Multiple Answers, Identification, Fill in the blank · 25 questions',
        numOfQuestions: 25,
    },
];

export const questionTypes: string[] = presets.map((p) => p.type);
