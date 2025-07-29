import { QuestionProp } from '@/types';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const TrueOrFalseQuestion = ({ id, question, options, number }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="font-semibold">
                <span>{number}.</span> {question}
            </p>

            <RadioGroup>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <RadioGroupItem id={option} value={option} />
                        <Label htmlFor={id.toString()} className="text-base font-normal">
                            {option}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default TrueOrFalseQuestion;
