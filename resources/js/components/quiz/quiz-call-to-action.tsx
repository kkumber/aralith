import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Download, PencilLine, Plus, Share2 } from 'lucide-react';

interface QuizCallToActionProps {
    lessonId: string | number;
}

const QuizCallToAction = ({ lessonId }: QuizCallToActionProps) => {
    return (
        <>
            {/* Desktop CTAs */}
            <div className="hidden gap-2 md:flex">
                <Button asChild>
                    <Link href={route('quiz.show', { lesson: lessonId })} title="Take Quiz" aria-label="Take Quiz">
                        <PencilLine />
                        <span className="ml-2">Take Quiz</span>
                    </Link>
                </Button>

                <Button variant="outline" asChild>
                    <Link
                        href={route('quiz.exportGoogleFormsInstructions', {
                            lesson: lessonId,
                        })}
                        title="Export to Google Form"
                        aria-label="Export to Google Form"
                    >
                        <Share2 />
                        <span className="ml-2">Export to Google Form</span>
                    </Link>
                </Button>

                <Button variant="outline" title="Download PDF" aria-label="Download PDF">
                    <Download />
                    <span className="ml-2">Download PDF</span>
                </Button>
            </div>

            {/* Mobile FAB menu */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" variant="secondary" title="More Options" aria-label="More Options">
                            <Plus />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="top" align="end" className="space-y-1">
                        <DropdownMenuItem asChild>
                            <Link href={route('quiz.show', { lesson: lessonId })}>
                                <PencilLine className="mr-2 h-4 w-4" />
                                Take Quiz
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route('quiz.exportGoogleFormsInstructions', {
                                    lesson: lessonId,
                                })}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Export to Google Form
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download DOCX
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};

export default QuizCallToAction;
