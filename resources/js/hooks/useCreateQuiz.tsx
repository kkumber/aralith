import { removeFromSessionStorage } from '@/lib/utils';
import { Difficulty, QuestionType } from '@/pages/quiz/config/config';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Values {
    title: string;
    selectedTypes: QuestionType[];
    numOfQuestions: number;
    difficulty: Difficulty;
    randomOrder: boolean;
}

const useCreateQuiz = () => {
    const [configErrors, setConfigErrors] = useState<Record<string, string>>({
        title: '',
        types: '',
        numOfQuestions: '',
        difficulty: '',
        randomOrder: '',
    });

    /*
     * Submit Config to generate quiz
     * Also submit the lesson with title and content
     *
     */
    const saveLessonQuiz = (values: Values, lesson: string) => {
        if (!validateValues(values)) return;

        const payload = {
            lesson: {
                title: values.title,
                content: lesson,
            },
            quiz_config: {
                title: values.title,
                config: {
                    question_types: values.selectedTypes,
                    difficulty: values.difficulty,
                    total_number_of_questions: values.numOfQuestions,
                    random_order: values.randomOrder,
                },
            },
        };

        router.post(route('lesson-quiz.store'), payload, {
            onSuccess: () => {
                removeFromSessionStorage('lesson');
            },
            onError: (errors) => {
                toast.error(errors?.message || errors?.general || 'Failed to generate quiz. Please try again.');
            },
        });
    };

    // Check if values are valid
    const validateValues = (values: Values) => {
        const errors: Record<string, string> = {};

        if (!values.title) {
            errors.title = 'Please enter a title for your quiz.';
        }
        if (!values.selectedTypes.length) {
            errors.types = 'Please select at least one question type.';
        }
        if (!values.difficulty) {
            errors.difficulty = 'Please select a difficulty level.';
        }
        if (!values.numOfQuestions || values.numOfQuestions < 1) {
            errors.numOfQuestions = 'Please select the number of questions.';
        }

        setConfigErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return { saveLessonQuiz, configErrors };
};

export default useCreateQuiz;
