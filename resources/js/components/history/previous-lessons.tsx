import { LessonResponse } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

interface Props {
    lessons: LessonResponse[];
}

const PreviousLessons = ({ lessons }: Props) => {
    const [selected, setSelected] = useState<number[]>([]);

    const handleSelected = (id: number) => {
        if (!id) return;

        if (selected.includes(id)) {
            const filtered = selected.filter((prev) => prev !== id);
            return setSelected(filtered);
        }

        setSelected((prev: number[]) => [...prev, id]);
    };

    console.log(selected);
    return (
        <section className="grid">
            <div className="flex items-center justify-between">
                <small>You have {lessons.length} previous lessons with Aralith</small>
                <Button variant={'link'}>Select</Button>
            </div>

            {lessons && lessons.length && (
                <div className="flex flex-col items-center justify-center">
                    {lessons.map((lesson: LessonResponse) => (
                        <Card className={`relative gap-1 ${selected.includes(lesson.id)}`} key={lesson.id}>
                            <Checkbox
                                className={`absolute top-9 -left-2 z-10 bg-[#fafafa] dark:bg-[#0a0a0a] ${selected.includes(lesson.id) ? 'bg-primary-green' : ''}`}
                                onCheckedChange={() => handleSelected(lesson.id)}
                            />
                            <CardContent>
                                <CardTitle>
                                    <Button variant={'link'} className="p-0 text-base font-bold" asChild>
                                        <Link href={route('lesson.show', { lesson: lesson.id })}>{lesson.title}</Link>
                                    </Button>
                                </CardTitle>
                                <p className="line-clamp-1 w-full overflow-hidden text-ellipsis">{lesson.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PreviousLessons;
