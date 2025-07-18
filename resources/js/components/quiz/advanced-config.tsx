import BlockBox from '@/components/ui/block-box';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Difficulty, difficultyLevels, presets, QuestionType } from '@/pages/quiz/config/config';
import { Info } from 'lucide-react';
import { CardTitle } from '../ui/card';

interface AdvancedConfig {
    numOfQuestions: number;
    handleNumOfQuestions: (arg: number) => void;
    selectedTypes: QuestionType[];
    difficulty: Difficulty;
    handleDifficulty: (arg: Difficulty) => void;
    randomOrder: boolean;
    handleRandomOrder: (arg: boolean) => void;
    handleAdvanceConfig: (arg: QuestionType) => void;
}

const AdvancedConfig = ({
    numOfQuestions,
    handleNumOfQuestions,
    selectedTypes,
    difficulty,
    handleDifficulty,
    randomOrder,
    handleRandomOrder,
    handleAdvanceConfig,
}: AdvancedConfig) => {
    return (
        <>
            <CardTitle className="text-xl">Advance Configuration</CardTitle>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <p>Number of Questions</p>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info size={15} />
                            </TooltipTrigger>
                            <TooltipContent>The total number of questions divided by the number of question types.</TooltipContent>
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
                    onValueChange={(val: number[]) => handleNumOfQuestions(val[0] ?? 10)}
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
                                onClick={() => handleDifficulty(level)}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox onClick={() => handleRandomOrder(!randomOrder)} defaultChecked />
                    <p>Randomize Question Order</p>
                </div>
            </div>
        </>
    );
};
export default AdvancedConfig;
