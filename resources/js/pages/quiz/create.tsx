import AdvancedConfig from '@/components/quiz/advanced-config';
import QuizPreset from '@/components/quiz/quiz-preset';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useQuizConfig from '@/hooks/useQuizConfig';
import AppLayout from '@/layouts/app-layout';
import { retrieveFromSessionStorage } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Configuration } from './config/config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
    {
        title: 'Configure Quiz',
        href: route('quiz.create'),
    },
];

const Create = () => {
    const { values, handlers } = useQuizConfig();

    /* Check if there is lesson on mount, redirect to main if not found */
    useEffect(() => {
        const lesson = retrieveFromSessionStorage('lesson');

        if (!lesson) {
            router.visit(route('main'));
            alert('No lesson found');
        }
    });

    const handleGenerateQuiz = () => {
        // Submit the config

        // The finalized quiz config.
        const configuration: Configuration = {
            question_types: values.selectedTypes,
            difficulty: values.difficulty,
            total_number_of_questions: values.numOfQuestions,
            random_order: values.randomOrder,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-6 shadow-md">
                    <QuizPreset handlePreset={handlers.handlePreset} currentPreset={values.currentPreset} />
                    <hr />
                    <CardContent className="space-y-4">
                        <AdvancedConfig
                            numOfQuestions={values.numOfQuestions}
                            handleNumOfQuestions={handlers.handleNumOfQuestions}
                            selectedTypes={values.selectedTypes}
                            handleAdvanceConfig={handlers.handleAdvanceConfig}
                            difficulty={values.difficulty}
                            handleDifficulty={handlers.handleDifficulty}
                            randomOrder={values.randomOrder}
                            handleRandomOrder={handlers.handleRandomOrder}
                        />
                        <Button className="w-full" onClick={handleGenerateQuiz}>
                            Generate Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
