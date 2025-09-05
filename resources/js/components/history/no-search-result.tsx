import { SearchX } from 'lucide-react';

const NoSearchResult = () => {
    return (
        <div className="mt-20 flex w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <SearchX size={80} className="text-text-primary dark:text-dark-text-primary" />
                <p>No results found. Try different keywords or adjust your filters.</p>
            </div>
        </div>
    );
};

export default NoSearchResult;
