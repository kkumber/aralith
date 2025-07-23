import { LessonResponse } from '@/types';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

dayjs.extend(relativeTime);

interface Props {
    lessons: LessonResponse[];
}

const PreviousLessons = ({ lessons }: Props) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [showCheckbox, setShowCheckbox] = useState<boolean>(false);

    const handleSelected = (id: number) => {
        if (!id) return;

        if (selected.includes(id)) {
            const filtered = selected.filter((prev) => prev !== id);
            return setSelected(filtered);
        }

        setSelected((prev: number[]) => [...prev, id]);
    };

    return (
        <section className="grid">
            <div className="mb-4 flex items-center justify-between">
                <small>You have {lessons.length} previous lessons with Aralith</small>
                <Button variant={'link'}>Select</Button>
            </div>

            {lessons && lessons.length && (
                <div className="flex flex-col items-center justify-center">
                    {lessons.map((lesson: LessonResponse) => (
                        <Card
                            /**
                             * Custom styles for the card. This is used to create
                             * a hover effect and to change the background color
                             * when the lesson is selected.
                             */
                            className={`relative gap-1 ${selected.includes(lesson.id) ? 'border-primary-green bg-primary-green/5' : ''} hover:border-primary-green z-0 w-full transition-all duration-300 ease-out hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/5`}
                            key={lesson.id}
                            onClick={() => handleSelected(lesson.id)}
                            onMouseEnter={() => setShowCheckbox(true)}
                            onMouseLeave={() => setShowCheckbox(false)}
                        >
                            <div
                                className={`absolute top-12 -left-2 z-10 transform transition-all duration-300 ease-out ${
                                    selected.includes(lesson.id) || showCheckbox
                                        ? 'translate-x-0 scale-100 opacity-100'
                                        : 'pointer-events-none -translate-x-2 scale-75 opacity-0'
                                }`}
                            >
                                <div
                                    className={`relative transform transition-all duration-200 ease-out ${
                                        selected.includes(lesson.id) || showCheckbox ? 'scale-100 rotate-0' : 'scale-95 -rotate-12'
                                    }`}
                                >
                                    {/* Ripple effect on hover */}
                                    <div
                                        className={`bg-primary-green/20 absolute inset-0 transform rounded-sm transition-all duration-300 ease-out ${
                                            showCheckbox && !selected.includes(lesson.id) ? 'scale-150 opacity-0' : 'scale-100 opacity-0'
                                        }`}
                                    />

                                    <Checkbox
                                        checked={selected.includes(lesson.id)}
                                        /**
                                         * Custom styles for the checkbox. This is used to create
                                         * a hover effect and to change the background color
                                         * when the lesson is selected.
                                         */
                                        className={`data-[state=checked]:bg-primary-green data-[state=checked]:border-primary-green relative transform transition-all duration-200 ease-out hover:scale-110 active:scale-95 data-[state=checked]:text-white data-[state=unchecked]:bg-[#fafafa] data-[state=unchecked]:dark:bg-[#0a0a0a] ${
                                            selected.includes(lesson.id) ? 'shadow-primary-green/25 shadow-lg' : 'shadow-sm hover:shadow-md'
                                        }`}
                                        onCheckedChange={() => handleSelected(lesson.id)}
                                    />
                                </div>
                            </div>

                            <CardContent>
                                <CardTitle>
                                    <Button variant={'link'} className="p-0 text-base font-bold" asChild>
                                        <Link href={route('lesson.show', { lesson: lesson.id })}>{lesson.title}</Link>
                                    </Button>
                                    {selected.length < 1 && (
                                        <Trash
                                            className={`absolute top-4 right-4 z-10 origin-right rounded-md opacity-0 transition-all duration-300 ease-out hover:scale-110 hover:rotate-3 hover:cursor-pointer active:scale-95 ${showCheckbox ? 'opacity-100' : ''}`}
                                            size={15}
                                        />
                                    )}
                                </CardTitle>

                                <p className="line-clamp-1 overflow-hidden text-ellipsis">{lesson.content}</p>
                                <small>{dayjs(lesson.updated_at).fromNow()}</small>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PreviousLessons;
