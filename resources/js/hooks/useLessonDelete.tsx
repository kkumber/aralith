import { useState } from 'react';

const useLessonDelete = () => {
    const [selected, setSelected] = useState<number[]>([]);

    const handleSelected = (id: number) => {
        if (!id) return;

        if (selected.includes(id)) {
            const filtered = selected.filter((prev) => prev !== id);
            return setSelected(filtered);
        }

        setSelected((prev: number[]) => [...prev, id]);
    };

    // Main Delete handler
    const handleDeleteItems = () => {
        if (!selected.length) return;

        // router.delete(route('lesson.bulkDestroy'), {lesson_ids: selected });
    };

    const handleConfirmDialog = (id: number) => {
        if (!id) return;
        console.log(id);
        // router.delete(route('lesson.destroy', id));
    };

    const setSelection = (param: number[]) => setSelected(param);

    return {
        selected,
        setSelection,
        handleSelected,
        handleDeleteItems,
        handleConfirmDialog,
    };
};

export default useLessonDelete;
