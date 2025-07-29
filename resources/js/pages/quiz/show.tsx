import FillInTheBlankQuestion from '@/components/quiz-types/fill-in-the-blank';
import IdentificationQuestion from '@/components/quiz-types/identification';
import MultipleAnswerQuestion from '@/components/quiz-types/multiple-answer';
import MultipleChoiceQuestion from '@/components/quiz-types/multiple-choice';
import TrueOrFalseQuestion from '@/components/quiz-types/true-false';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, QuizResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const Show = () => {
    const { quiz } = usePage<{ quiz: QuizResponse }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: quiz.title,
            href: route('lesson.show', { lesson: quiz.lessons_id }),
        },
        {
            title: 'Quiz Attempt',
            href: route('quiz.show', { lesson: quiz.lessons_id }),
        },
    ];

    console.log(usePage());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quiz Attempt" />

            <main className="mx-auto flex h-full max-w-screen-lg flex-col gap-6 p-4">
                {quiz.questions?.map((question, index) => {
                    // Multiple choice questions
                    if (question.type === 'Multiple Choice') {
                        return (
                            <MultipleChoiceQuestion
                                key={question.id}
                                number={index + 1}
                                question={question.question_text}
                                options={question.options}
                                id={question.id}
                            />
                        );
                    }

                    // Multiple answers questions
                    if (question.type === 'Multiple Answers') {
                        return (
                            <MultipleAnswerQuestion
                                key={question.id}
                                id={question.id}
                                number={index + 1}
                                question={question.question_text}
                                options={question.options}
                            />
                        );
                    }

                    // True or false questions
                    if (question.type === 'True/False') {
                        return (
                            <TrueOrFalseQuestion
                                key={question.id}
                                id={question.id}
                                number={index + 1}
                                question={question.question_text}
                                options={question.options}
                            />
                        );
                    }

                    // Identification questions
                    if (question.type === 'Identification') {
                        return (
                            <IdentificationQuestion
                                key={question.id}
                                id={question.id}
                                number={index + 1}
                                question={question.question_text}
                                options={question.options}
                            />
                        );
                    }

                    // Fill in the blank questions
                    if (question.type === 'Fill in the blank') {
                        return (
                            <FillInTheBlankQuestion
                                key={question.id}
                                id={question.id}
                                number={index + 1}
                                question={question.question_text}
                                options={question.options}
                            />
                        );
                    }

                    return null; // fallback to unknown question type
                })}
            </main>
        </AppLayout>
    );
};

export default Show;
