import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';

const LessonSearch = () => {
    const [search, setSearch] = useState<string>('');
    const redirectToSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!search) return;

        router.post(route('lesson.search'), { search: search });
    };

    return (
        <form className="relative mt-8 mb-3 w-full" onSubmit={redirectToSearch}>
            <Search size={15} className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 transform" />
            <Input
                type="text"
                name="lesson_search"
                id="lessonSearch"
                placeholder="Search your lessons..."
                className="text-md w-full py-5 pr-5 pl-10"
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    );
};

export default LessonSearch;
