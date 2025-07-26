import { removeFromSessionStorage } from '@/lib/utils';
import { Difficulty, QuestionType } from '@/pages/quiz/config/config';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Values {
    title: string;
    selectedTypes: QuestionType[];
    numOfQuestions: number;
    difficulty: Difficulty;
    randomOrder: boolean;
}

const useCreateQuiz = () => {
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
        const errors: string[] = [];

        if (!values.title) errors.push('Please enter a title for your quiz.');
        if (!values.selectedTypes.length) errors.push('Please select at least one question type.');
        if (!values.difficulty) errors.push('Please select a difficulty level.');
        if (!values.numOfQuestions || values.numOfQuestions < 1) errors.push('Please select the number of questions.');

        if (errors.length > 0) {
            toast.error(
                <div>
                    <strong>Error:</strong>
                    <ul className="mt-1 ml-4">
                        {errors.map((error, index) => (
                            <li key={index} className="list-disc">
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>,
            );
            return false;
        }

        return true;
    };

    return { saveLessonQuiz, validateValues };
};

export default useCreateQuiz;
