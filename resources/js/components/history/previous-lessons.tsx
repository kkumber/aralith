import { LessonResponse } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';

interface Props {
    lessons: LessonResponse[];
}

const PreviousLessons = ({ lessons }: Props) => {
    const [selected, setSelected] = useState([]);

    const handleSelected = (id: number) => {};

    return (
        <section className="grid">
            <div className="flex items-center justify-between">
                <small>You have {lessons.length} previous lessons with Aralith</small>
                <Button variant={'link'}>Select</Button>
            </div>

            {lessons && lessons.length && (
                <div className="flex flex-col items-center justify-center">
                    {lessons.map((lesson: LessonResponse) => (
                        <Card className="gap-1">
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
