import CodeBlock from '@/components/ui/code-block';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Download, ExternalLink, Eye, EyeOff, Play } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    script: string;
    instructions?: {
        setup: string[];
    };
}

interface StepProps {
    step: StepData;
    index: number;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

interface StepData {
    title: string;
    description: string;
    content: React.ReactNode;
    estimatedTime?: string;
}

interface AlertBoxProps {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

interface ProgressBarProps {
    current: number;
    total: number;
}

const AlertBox = ({ type, title, children, icon }: AlertBoxProps) => {
    const styles = {
        info: {
            container: 'bg-primary-green/5 border-primary-green/20 dark:bg-primary-green/10 dark:border-primary-green/25',
            icon: 'text-primary-green',
            title: 'text-primary-green dark:text-primary-green',
        },
        success: {
            container: 'bg-secondary-green/5 border-secondary-green/20 dark:bg-secondary-green/10 dark:border-secondary-green/25',
            icon: 'text-secondary-green',
            title: 'text-secondary-green dark:text-secondary-green',
        },
        warning: {
            container: 'bg-third-green/5 border-third-green/20 dark:bg-third-green/10 dark:border-third-green/25',
            icon: 'text-third-green',
            title: 'text-third-green dark:text-third-green',
        },
        error: {
            container: 'bg-destructive/5 border-destructive/20 dark:bg-destructive/10 dark:border-destructive/25',
            icon: 'text-destructive',
            title: 'text-destructive dark:text-destructive',
        },
    };

    const currentStyle = styles[type];

    return (
        <div className={`${currentStyle.container} rounded-xl border p-4 transition-all duration-200`}>
            <div className="flex items-start space-x-3">
                <div className={`${currentStyle.icon} mt-0.5 flex-shrink-0`}>{icon || <AlertCircle className="h-5 w-5" />}</div>
                <div className="min-w-0 flex-1">
                    <p className={`${currentStyle.title} text-sm font-semibold`}>{title}</p>
                    <div className="text-text-secondary dark:text-dark-text-secondary mt-1 text-sm">{children}</div>
                </div>
            </div>
        </div>
    );
};

const ProgressBar = ({ current, total }: ProgressBarProps) => {
    const percentage = (current / total) * 100;

    return (
        <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                    Progress: {current} of {total} steps completed
                </span>
                <span className="text-primary-green text-sm font-medium">{Math.round(percentage)}%</span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div className="bg-primary-green h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const StepCard = ({ step, index, isCompleted, onToggleComplete }: StepProps) => {
    const [isExpanded, setIsExpanded] = useState(index === 0);

    return (
        <div
            className={`border-border overflow-hidden rounded-xl border transition-all duration-300 ${
                isCompleted ? 'bg-secondary-green/5 border-secondary-green/20' : 'bg-card hover:shadow-md'
            }`}
        >
            {/* Header */}
            <div className="hover:bg-muted/50 cursor-pointer px-6 py-5 transition-colors duration-200" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete();
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                isCompleted ? 'bg-secondary-green border-secondary-green text-white' : 'border-border hover:border-primary-green'
                            }`}
                        >
                            {isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <span className="text-text-secondary text-sm font-bold">{index + 1}</span>
                            )}
                        </button>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-text-primary dark:text-dark-text-primary text-lg font-semibold">{step.title}</h3>
                            <p className="text-text-tertiary dark:text-dark-text-tertiary mt-1 text-sm">{step.description}</p>
                            {step.estimatedTime && (
                                <div className="text-text-tertiary dark:text-dark-text-tertiary mt-2 flex items-center text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {step.estimatedTime}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="hover:bg-muted rounded-lg p-2 transition-colors">
                        {isExpanded ? <EyeOff className="text-text-tertiary h-4 w-4" /> : <Eye className="text-text-tertiary h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="border-border/50 border-t px-6 pb-6">
                    <div className="pt-4">{step.content}</div>
                </div>
            )}
        </div>
    );
};

const GoogleFormExportInstructions = () => {
    const { script } = usePage<{ script: string }>().props;
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [showAlternative, setShowAlternative] = useState(false);

    const toggleStepComplete = (stepIndex: number) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepIndex)) {
            newCompleted.delete(stepIndex);
        } else {
            newCompleted.add(stepIndex);
        }
        setCompletedSteps(newCompleted);
    };

    const steps: StepData[] = [
        {
            title: 'Copy the Script Code',
            description: 'Get the automated script that will create your Google Forms',
            estimatedTime: '1 minute',
            content: (
                <div className="space-y-4">
                    <p>
                        Click the code block below to expand it, then copy all the code. You'll paste this into Google Apps Script in the next steps.
                    </p>

                    <AlertBox type="info" title="Pro Tip" icon={<Download className="h-5 w-5" />}>
                        You can click the "Copy" button that appears when you hover over the code block to copy everything at once.
                    </AlertBox>

                    <div className="border-border bg-muted/30 overflow-hidden rounded-xl border">
                        <CodeBlock defaultCollapsed={true}>{script}</CodeBlock>
                    </div>
                </div>
            ),
        },
        {
            title: 'Open Google Apps Script',
            description: "Navigate to Google's script editor",
            estimatedTime: '30 seconds',
            content: (
                <div className="space-y-4">
                    <p>Open a new browser tab and go to Google Apps Script. This is Google's platform for running custom scripts.</p>

                    <div className="bg-card border-border rounded-xl border p-4">
                        <a
                            href="https://script.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:hover:text-third-green group inline-flex items-center space-x-2 font-medium transition-colors"
                        >
                            <span>https://script.google.com</span>
                            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </div>

                    <AlertBox type="success" title="Verification" icon={<CheckCircle className="h-5 w-5" />}>
                        This is an official Google website. You can verify by checking that the URL starts with "script.google.com".
                    </AlertBox>
                </div>
            ),
        },
        {
            title: 'Create a New Project',
            description: 'Start a new script project',
            estimatedTime: '30 seconds',
            content: (
                <div className="space-y-4">
                    <p>
                        Once you're on the Google Apps Script homepage, click the <strong>New Project</strong> button. This will open the script
                        editor with a blank project.
                    </p>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">
                            [Screenshot: Google Apps Script homepage with "New Project" button highlighted]
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Replace the Default Code',
            description: 'Paste your form creation script',
            estimatedTime: '1 minute',
            content: (
                <div className="space-y-4">
                    <p>
                        The script editor will open with some default code. Select all the existing code (Ctrl+A or Cmd+A) and delete it, then paste
                        the code you copied from Step 1.
                    </p>

                    <AlertBox type="error" title="Important" icon={<AlertCircle className="h-5 w-5" />}>
                        Make sure you replace ALL the existing code. The editor should only contain the code you copied from Step 1.
                    </AlertBox>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Script editor with code pasted in]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Save Your Project',
            description: 'Give your project a meaningful name',
            estimatedTime: '30 seconds',
            content: (
                <div className="space-y-4">
                    <p>
                        Save your project by pressing{' '}
                        <kbd className="bg-muted border-border rounded border px-2 py-1 font-mono text-sm">Ctrl + S</kbd> (or{' '}
                        <kbd className="bg-muted border-border rounded border px-2 py-1 font-mono text-sm">Cmd + S</kbd> on Mac) or clicking the save
                        icon in the toolbar. Give it a descriptive name like "Form Creator for [Your Class/Subject]".
                    </p>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Save dialog with project name field]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Run the Script',
            description: 'Execute the script and grant permissions',
            estimatedTime: '2-3 minutes',
            content: (
                <div className="space-y-4">
                    <p>
                        Click the <strong>Run</strong> button (▶️ play icon) in the toolbar. The first time you run this script, Google will ask for
                        permission to access your Google Drive and Forms.
                    </p>

                    <AlertBox type="info" title="Authorization Required" icon={<Play className="h-5 w-5" />}>
                        Google will show a security warning because this is a custom script. Click "Advanced" then "Go to [project name] (unsafe)" to
                        proceed. This is normal and safe for scripts you create yourself.
                    </AlertBox>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Run button and authorization dialog]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Collect Your Form Links',
            description: 'Find and save the generated links',
            estimatedTime: '1 minute',
            content: (
                <div className="space-y-4">
                    <p>
                        After the script runs successfully, check the <strong>execution log</strong> (usually at the bottom of the screen). You'll
                        find links to your newly created Google Forms and the response collection sheet.
                    </p>

                    <AlertBox type="success" title="What You'll Get" icon={<CheckCircle className="h-5 w-5" />}>
                        <ul className="mt-2 space-y-1">
                            <li>• Teacher form link (for creating questions)</li>
                            <li>• Student form link (for answering questions)</li>
                            <li>• Response sheet link (for viewing answers)</li>
                        </ul>
                    </AlertBox>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Execution log showing generated links]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Verify in Google Drive',
            description: 'Check that your forms were created successfully',
            estimatedTime: '30 seconds',
            content: (
                <div className="space-y-4">
                    <p>
                        Open{' '}
                        <a
                            href="https://drive.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:hover:text-third-green transition-colors"
                        >
                            Google Drive
                        </a>{' '}
                        in a new tab. You should see your newly created Google Forms in your drive, ready to be shared with students.
                    </p>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Google Drive showing created forms]</p>
                    </div>
                </div>
            ),
        },
    ];

    const alternativeSteps = [
        {
            title: 'Access Apps Script from Google Forms',
            content: (
                <div className="space-y-4">
                    <p>
                        If you prefer to start from Google Forms, go to{' '}
                        <a
                            href="https://forms.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:hover:text-third-green transition-colors"
                        >
                            forms.google.com
                        </a>{' '}
                        and select <strong>Blank form</strong> from the main menu.
                    </p>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">
                            [Screenshot: Google Forms homepage with "Blank form" option]
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Open Apps Script',
            content: (
                <div className="space-y-4">
                    <p>
                        In the form editor, look for the <strong>three vertical dots</strong> (⋮) in the top-right corner, usually near your profile
                        picture. Click on it and select <strong>Apps Script</strong> from the dropdown menu.
                    </p>

                    <div className="bg-muted/30 border-border rounded-xl border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">
                            [Screenshot: Google Forms menu with Apps Script option highlighted]
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Continue with Main Steps',
            content: (
                <p>
                    From here, follow steps 4-8 from the main instructions above to paste your code, save the project, run the script, and collect
                    your form links.
                </p>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Google Forms Setup Instructions" />
            <main className="mx-auto max-w-4xl space-y-8 p-6">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1>Google Forms Automation Setup</h1>
                    <p className="mx-auto max-w-2xl text-lg">
                        Follow these interactive step-by-step instructions to automatically create Google Forms for your classroom. This process will
                        generate both teacher and student forms, plus a response collection sheet.
                    </p>
                </div>

                {/* Time Estimate */}
                <AlertBox type="info" title="Estimated Time: 10-15 minutes" icon={<Clock className="h-5 w-5" />}>
                    Most of this time is spent waiting for Google to process the script. The actual work takes just a few minutes.
                </AlertBox>

                {/* Progress Bar */}
                <ProgressBar current={completedSteps.size} total={steps.length} />

                {/* Main Instructions */}
                <div className="space-y-6">
                    <h2 className="text-center">Main Instructions</h2>
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            step={step}
                            index={index}
                            isCompleted={completedSteps.has(index)}
                            onToggleComplete={() => toggleStepComplete(index)}
                        />
                    ))}
                </div>

                {/* Alternative Method Toggle */}
                <div className="border-border border-t pt-8 text-center">
                    <button
                        onClick={() => setShowAlternative(!showAlternative)}
                        className="bg-muted hover:bg-muted/80 text-text-primary dark:text-dark-text-primary rounded-xl px-6 py-3 font-medium transition-colors"
                    >
                        {showAlternative ? 'Hide' : 'Show'} Alternative Method: Starting from Google Forms
                    </button>
                </div>

                {/* Alternative Method */}
                {showAlternative && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2>Alternative Method</h2>
                            <p>If you're more comfortable starting from Google Forms interface, you can use this approach:</p>
                        </div>

                        {alternativeSteps.map((step, index) => (
                            <div key={index} className="bg-card border-border rounded-xl border p-6">
                                <h3 className="mb-4">
                                    Alternative Step {index + 1}: {step.title}
                                </h3>
                                {step.content}
                            </div>
                        ))}
                    </div>
                )}

                {/* Help Section */}
                <AlertBox type="error" title="Need Help?" icon={<AlertCircle className="h-5 w-5" />}>
                    <p className="mb-2">If you encounter any issues:</p>
                    <ul className="ml-4 list-inside list-disc space-y-1">
                        <li>Make sure you're signed into the correct Google account</li>
                        <li>Check that you have permission to create files in Google Drive</li>
                        <li>Ensure you've copied the entire script code without any missing parts</li>
                        <li>Try refreshing the page and running the script again if it doesn't work the first time</li>
                    </ul>
                </AlertBox>
            </main>
        </AppLayout>
    );
};

export default GoogleFormExportInstructions;
