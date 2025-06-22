import { CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import BlockBox from '@/components/ui/block-box';
import { Info } from 'lucide-react';
import { presets, difficultyLevels, Difficulty } from "@/pages/quiz/config/config";


const AdvancedConfig = ({numOfQuestions, handleNumOfQuestions, selectedTypes, difficulty, handleDifficulty, randomOrder, handleRandomOrder}) => {
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
                                <Checkbox onClick={() => setRandomOrder(!randomOrder)} defaultChecked />
                                <p>Randomize Question Order</p>
                            </div>
                        </div> 
    </>
    ) 
export default AdvancedConfig;