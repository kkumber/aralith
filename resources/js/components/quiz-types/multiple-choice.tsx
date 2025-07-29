import { QuestionProp } from '@/types';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const MultipleChoiceQuestion = ({ id, question, options, number }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p>
                <span className="text-sm">{number}.</span> {question}
            </p>
            <RadioGroup>
                {options.map((option, index) => (
                    <div key={index} className="ml-8 flex items-center gap-2">
                        <RadioGroupItem id={option} value={option} />
                        <Label htmlFor={id.toString()} className="text-base">
                            {option}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default MultipleChoiceQuestion;
