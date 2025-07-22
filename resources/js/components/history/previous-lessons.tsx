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
                                className={`data-[state=checked]:bg-primary-green data-[state=checked]:border-primary-green absolute top-9 -left-2 z-10 data-[state=checked]:text-white data-[state=unchecked]:bg-[#fafafa] data-[state=unchecked]:dark:bg-[#0a0a0a]`}
                                onCheckedChange={() => handleSelected(lesson.id)}
                            />
                            <CardContent>
                                <CardTitle>
                                    <Button variant={'link'} className="p-0 text-base font-bold" asChild>
                                        <Link href={route('lesson.show', { lesson: lesson.id })}>{lesson.title}</Link>
                                    </Button>
                                </CardTitle>
                                <p className="line-clamp-1 w-full overflow-hidden text-ellipsis">{lesson.content}</p>
                                <small>{lesson.updated_at}</small>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PreviousLessons;
