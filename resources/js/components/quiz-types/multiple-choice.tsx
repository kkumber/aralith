import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface Question {
    id: number;
    question: string;
    options: string[];
    number: number;
}

const MultipleChoiceQuestion = ({ id, question, options, number }: Question) => {
    return (
        <div>
            <p>
                {number}. {question}
            </p>
            <RadioGroup>
                {options.map((option, index) => (
                    <div key={index} className="ml-4 flex items-center gap-2">
                        <RadioGroupItem id={option} value={option} />
                        <Label htmlFor={id.toString()}>{option}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default MultipleChoiceQuestion;
