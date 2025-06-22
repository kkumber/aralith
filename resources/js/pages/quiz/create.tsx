import QuizPreset from '@/components/quiz-preset';
import BlockBox from '@/components/ui/block-box';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { Configuration, Difficulty, difficultyLevels, presets, QuestionType, questionTypes } from './config/config';

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
        if (!type) return;
        if (!questionTypes.includes(type)) return;

        setSelectedTypes([type]);
        setCurrentPreset(type);
        setNumOfQuestions(numOfQuestions);
    };

    // In advance configuration, users can set multiple question types
    const handleAdvanceConfig = (type: QuestionType) => {
        if (!type) return;
        if (!questionTypes.includes(type)) return;

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
                        <CardTitle className="text-xl">Advance Configuration</CardTitle>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <p>Number of Questions</p>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info size={15} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Calculated by dividing the total number of questions by the number of question types.
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <p>{numOfQuestions}</p>
                            </div>
                            <Slider
                                defaultValue={[numOfQuestions]}
                                value={[numOfQuestions]}
                                step={1}
                                max={50}
                                min={1}
                                onValueChange={(val: number[]) => setNumOfQuestions(val[0] ?? 10)}
                            />
                            <div className="flex flex-col justify-center gap-2">
                                <p>Question Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {presets.map((p, index) => (
                                        <BlockBox
                                            item={p.type}
                                            key={index}
                                            onClick={() => handleAdvanceConfig(p.type)}
                                            className={selectedTypes.includes(p.type) ? 'bg-primary-green' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <p>Difficulty Level</p>
                                <div className="flex flex-wrap gap-2">
                                    {difficultyLevels.map((level, index) => (
                                        <BlockBox
                                            item={level}
                                            key={index}
                                            className={difficulty === level ? 'bg-primary-green' : ''}
                                            onClick={() => setDifficulty(level)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onClick={() => setRandomOrder(!randomOrder)} defaultChecked />
                                <p>Randomize Question Order</p>
                            </div>
                        </div>
                        <Button className="w-full">Generate Quiz</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
