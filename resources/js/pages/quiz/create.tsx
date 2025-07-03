import AdvancedConfig from '@/components/quiz/advanced-config';
import QuizPreset from '@/components/quiz/quiz-preset';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Configuration, Difficulty, QuestionType, questionTypes } from './config/config';

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
    const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
    const [numOfQuestions, setNumOfQuestions] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [randomOrder, setRandomOrder] = useState<boolean>(true);
    const [currentPreset, setCurrentPreset] = useState<string>('');

    // When a preset is clicked, it changes the configuration
    const handlePreset = (type: QuestionType, numOfQuestions: number) => {
        if (!type || !questionTypes.includes(type)) return;

        setSelectedTypes([type]);
        setCurrentPreset(type);
        setNumOfQuestions(numOfQuestions);
    };

    // In advance configuration, users can set multiple question types
    const handleAdvanceConfig = (type: QuestionType) => {
        if (!type || !questionTypes.includes(type)) return;

        // Clear preset
        if (currentPreset) {
            setCurrentPreset('');
        }

        // If chosen type is mixed, remove all existing types and replace with mixed
        if (type === 'Mixed') {
            setSelectedTypes([type]);
            return;
        }

        // If there is a Mixed type, remove it
        if (selectedTypes.includes('Mixed')) {
            const removeMixed = selectedTypes.filter((currentType) => currentType !== 'Mixed');
            setSelectedTypes([...removeMixed, type]);
            return;
        }

        // If already included, remove it
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((currentType) => currentType !== type));
            return;
        }

        setSelectedTypes([...selectedTypes, type]);
    };

    const handleNumOfQuestions = (num: number) => {
        setNumOfQuestions(num);
    };

    const handleDifficulty = (difficulty: Difficulty) => {
        setDifficulty(difficulty);
    };

    const handleRandomOrder = (randomOrder: boolean) => {
        setRandomOrder(randomOrder);
    };

    const handleGenerateQuiz = () => {
        // Submit the config

        // The finalized quiz config.
        const configuration: Configuration = {
            question_types: selectedTypes,
            difficulty: difficulty,
            total_number_of_questions: numOfQuestions,
            random_order: randomOrder,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-6 shadow-md">
                    <QuizPreset handlePreset={handlePreset} currentPreset={currentPreset} />
                    <hr />
                    <CardContent className="space-y-4">
                        <AdvancedConfig
                            numOfQuestions={numOfQuestions}
                            handleNumOfQuestions={handleNumOfQuestions}
                            selectedTypes={selectedTypes}
                            handleAdvanceConfig={handleAdvanceConfig}
                            difficulty={difficulty}
                            handleDifficulty={handleDifficulty}
                            randomOrder={randomOrder}
                            handleRandomOrder={handleRandomOrder}
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
