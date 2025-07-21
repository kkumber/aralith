import { LessonResponse } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const PreviousLessons = ({ lessons }: any) => {
    return (
        <section className="grid">
            <div className="flex items-center justify-between">
                <small>You have {lessons.data.length} previous lessons with Aralith</small>
                <Button variant={'link'}>Select</Button>
            </div>

            {lessons && lessons.data.length && (
                <div className="flex flex-col items-center justify-center">
                    {lessons.data.map((lesson: LessonResponse) => (
                        <Card className="gap-1">
                            <CardHeader>
                                <CardTitle>
                                    <Button variant={'link'} className="p-0 text-base" asChild>
                                        <Link href={route('lesson.show', { lesson: lesson.id })}>{lesson.title}</Link>
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
