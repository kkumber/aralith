import { QuestionProp } from '@/types';
import { Input } from '../ui/input';

const IdentificationQuestion = ({ id, question, options, number }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="font-semibold">
                <span>{number}.</span> {question}
            </p>
            <Input placeholder="Answer..." className="w-40 font-normal" />
        </div>
    );
};

export default IdentificationQuestion;
