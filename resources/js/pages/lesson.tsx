import QuizAttemptsList from '@/components/quiz/quiz-attempts';
import QuizCallToAction from '@/components/quiz/quiz-call-to-action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Flashcard from '@/components/ui/flashcard';
import AppLayout from '@/layouts/app-layout';
import { isScorePassed } from '@/lib/utils';
import { BreadcrumbItem, LessonResponse, QuizAttemptsResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookText, Brain, ClipboardList } from 'lucide-react';

const Lesson = () => {
    const { lesson, quizAttempts } = usePage<{ lesson: LessonResponse; quizAttempts: QuizAttemptsResponse[] }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: lesson.title,
            href: route('lesson.index'),
        },
    ];

    console.log(quizAttempts);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />
            <main className="mx-auto max-w-screen-lg space-y-8 p-4">
                <header className="flex items-center gap-2">
                    <BookText className="text-primary-green" size={40} />
                    <h1>
                        Lesson: <span className="text-primary-green">"{lesson.title}"</span>
                    </h1>
                </header>

                {/* Sumamry */}
                <section>
                    <Card className="bg-sidebar shadow-md">
                        <CardHeader>
                            <CardTitle className="text-primary-green text-xl">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{lesson.summary}</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
                    <QuizCallToAction lessonId={lesson.id} />
                </div>

                {/* Quiz Attempts */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="text-primary-green" size={40} />
                        <h2>Quiz Attempts</h2>
                    </div>

                    <Card className="bg-primary-green/5 rounded-sm shadow-md">
                        <CardContent>
                            {quizAttempts &&
                                quizAttempts.map((quizAttempt, index) => (
                                    <QuizAttemptsList
                                        key={quizAttempt.id}
                                        quizAttemptNumber={index + 1}
                                        passed={isScorePassed(quizAttempt.score, quizAttempt.user_answers.length)}
                                        score={quizAttempt.score}
                                        totalNumOfQuestions={quizAttempt.user_answers.length}
                                        date={quizAttempt.created_at}
                                    />
                                ))}
                        </CardContent>
                    </Card>
                </section>

                {/* Flashcards */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Brain className="text-primary-green" size={40} /> <h2>Flashcards</h2>
                    </div>

                    {lesson.flashcard &&
                        lesson.flashcard.map((flashcard) => (
                            <Flashcard frontcard={flashcard.question} backcard={flashcard.answer} key={flashcard.id} />
                        ))}
                </section>
            </main>
        </AppLayout>
    );
};

export default Lesson;
