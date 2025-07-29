import FillInTheBlankQuestion from '@/components/quiz-types/fill-in-the-blank';
import IdentificationQuestion from '@/components/quiz-types/identification';
import MultipleAnswerQuestion from '@/components/quiz-types/multiple-answer';
import MultipleChoiceQuestion from '@/components/quiz-types/multiple-choice';
import TrueOrFalseQuestion from '@/components/quiz-types/true-false';
import { Button } from '@/components/ui/button';
import DialogSubmit from '@/components/ui/dialog-submit';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, QuizResponse } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const Show = () => {
    const { quiz } = usePage<{ quiz: QuizResponse }>().props;
    const [answers, setAnswers] = useState({});

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

    // Update user answers
    const handleAnswerChange = (questionId: number, answer: string | string[]) => {
        if (!questionId || !answer) return;

        setAnswers((prev) => ({
            ...prev,
            [questionId]: typeof answer === 'string' ? answer.trim() : answer,
        }));
    };

    const handleSubmit = () => {
        router.post(route('quizAttempt.store', { quiz: quiz.lessons_id }), {
            answers,
        });
    };

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
                                onChange={handleAnswerChange}
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
                                onChange={handleAnswerChange}
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
                                onChange={handleAnswerChange}
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
                                onChange={handleAnswerChange}
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
                                onChange={handleAnswerChange}
                            />
                        );
                    }

                    return null; // return if question type is not supported
                })}

                <div className="flex items-center justify-end">
                    <DialogSubmit
                        submitFn={handleSubmit}
                        config={{
                            triggerContent: <Button>Submit Answers</Button>,
                            titleContent: 'Submit Answers?',
                            descriptionContent: 'Are you sure you want to submit your answers?',
                            showWarningText: true,
                            warningTextContent: 'Please check your answers before submitting. This action cannot be undone.',
                            closeBtn: 'Cancel',
                            submitBtn: 'Submit',
                            submitBtnVariant: 'default',
                        }}
                    />
                </div>
            </main>
        </AppLayout>
    );
};

export default Show;
