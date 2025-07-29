import { QuestionProp } from '@/types';
import { Input } from '../ui/input';

const FillInTheBlankQuestion = ({ id, question, options, number, onChange }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="font-semibold">
                <span>{number}.</span> {question}
            </p>
            <Input placeholder="Answer..." className="w-40 font-normal" name={id.toString()} onChange={(e) => onChange?.(id, e.target.value)} />
        </div>
    );
};

export default FillInTheBlankQuestion;
