import CodeBlock from '@/components/ui/code-block';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const GoogleFormExportInstructions = () => {
    const { script } = usePage<{ script: string }>().props;

    const steps = [
        {
            title: 'Copy the Script Code',
            description: "First, you'll need to copy the automated script that will create your Google Forms.",
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Click the code block below to expand it, then copy all the code. You'll paste this into Google Apps Script in the next steps.
                    </p>
                    <div className="bg-primary-green/10 border-secondary-green/30 dark:bg-primary-green/20 dark:border-secondary-green/40 rounded-lg border p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-secondary-green mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-primary-green dark:text-secondary-green text-sm font-medium">Pro Tip</p>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                                    You can click "Copy" button that appears when you hover over the code block to copy everything at once.
                                </p>
                            </div>
                        </div>
                    </div>
                    <article className="border-light-border dark:border-dark-border overflow-hidden rounded-lg border">
                        <CodeBlock defaultCollapsed={true}>{script}</CodeBlock>
                    </article>
                </div>
            ),
        },
        {
            title: 'Open Google Apps Script',
            description: "Navigate to Google's script editor where you'll paste the code.",
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Open a new browser tab and go to Google Apps Script. This is Google's platform for running custom scripts.
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border p-4">
                        <a
                            href="https://script.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:text-secondary-green dark:hover:text-third-green inline-flex items-center space-x-2 font-medium"
                        >
                            <span>https://script.google.com</span>
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="bg-third-green/10 border-third-green/30 dark:bg-third-green/20 dark:border-third-green/40 rounded-lg border p-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="text-primary-green dark:text-third-green mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-primary-green dark:text-third-green text-sm font-medium">Verification</p>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                                    This is an official Google website. You can verify by checking that the URL starts with "script.google.com".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Create a New Project',
            description: "Start a new script project where you'll paste the form creation code.",
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Once you're on the Google Apps Script homepage, click the <strong>New Project</strong> button. This will open the script
                        editor with a blank project.
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">
                            [Screenshot: Google Apps Script homepage with "New Project" button highlighted]
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Replace the Default Code',
            description: 'Remove the placeholder code and paste your form creation script.',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        The script editor will open with some default code. Select all the existing code (Ctrl+A or Cmd+A) and delete it, then paste
                        the code you copied from Step 1.
                    </p>
                    <div className="bg-destructive/10 border-destructive/30 dark:bg-destructive/20 dark:border-destructive/40 rounded-lg border p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-destructive text-sm font-medium">Important</p>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                                    Make sure you replace ALL the existing code. The editor should only contain the code you copied from Step 1.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Script editor with code pasted in]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Save Your Project',
            description: 'Give your project a meaningful name and save it.',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Save your project by pressing{' '}
                        <kbd className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded border px-2 py-1 text-sm">
                            Ctrl + S
                        </kbd>{' '}
                        (or{' '}
                        <kbd className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded border px-2 py-1 text-sm">
                            Cmd + S
                        </kbd>{' '}
                        on Mac) or clicking the save icon in the toolbar. Give it a descriptive name like "Form Creator for [Your Class/Subject]".
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Save dialog with project name field]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Run the Script',
            description: 'Execute the script and grant necessary permissions.',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Click the <strong>Run</strong> button (▶️ play icon) in the toolbar. The first time you run this script, Google will ask for
                        permission to access your Google Drive and Forms.
                    </p>
                    <div className="bg-primary-green/10 border-secondary-green/30 dark:bg-primary-green/20 dark:border-secondary-green/40 rounded-lg border p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-secondary-green mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-primary-green dark:text-secondary-green text-sm font-medium">Authorization Required</p>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                                    Google will show a security warning because this is a custom script. Click "Advanced" then "Go to [project name]
                                    (unsafe)" to proceed. This is normal and safe for scripts you create yourself.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Run button and authorization dialog]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Collect Your Form Links',
            description: 'Find and save the generated Google Forms and response sheet links.',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        After the script runs successfully, check the <strong>execution log</strong> (usually at the bottom of the screen). You'll
                        find links to your newly created Google Forms and the response collection sheet.
                    </p>
                    <div className="bg-third-green/10 border-third-green/30 dark:bg-third-green/20 dark:border-third-green/40 rounded-lg border p-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="text-primary-green dark:text-third-green mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="text-primary-green dark:text-third-green text-sm font-medium">What You'll Get</p>
                                <ul className="text-text-secondary dark:text-dark-text-secondary mt-1 space-y-1 text-sm">
                                    <li>• Teacher form link (for creating questions)</li>
                                    <li>• Student form link (for answering questions)</li>
                                    <li>• Response sheet link (for viewing answers)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Execution log showing generated links]</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Verify in Google Drive',
            description: 'Check that your forms were created successfully.',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Open{' '}
                        <a
                            href="https://drive.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:text-secondary-green dark:hover:text-third-green"
                        >
                            Google Drive
                        </a>{' '}
                        in a new tab. You should see your newly created Google Forms in your drive, ready to be shared with students.
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
                        <p className="text-text-tertiary dark:text-dark-text-tertiary italic">[Screenshot: Google Drive showing created forms]</p>
                    </div>
                </div>
            ),
        },
    ];

    const alternativeMethod = [
        {
            title: 'Access Apps Script from Google Forms',
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        If you prefer to start from Google Forms, go to{' '}
                        <a
                            href="https://forms.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-green hover:text-secondary-green dark:text-secondary-green dark:hover:text-third-green"
                        >
                            forms.google.com
                        </a>{' '}
                        and select <strong>Blank form</strong> from the main menu.
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
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
                <div className="space-y-3">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        In the form editor, look for the <strong>three vertical dots</strong> (⋮) in the top-right corner, usually near your profile
                        picture. Click on it and select <strong>Apps Script</strong> from the dropdown menu.
                    </p>
                    <div className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border-2 border-dashed p-8 text-center">
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
                <p className="text-text-secondary dark:text-dark-text-secondary">
                    From here, follow steps 4-8 from the main instructions above to paste your code, save the project, run the script, and collect
                    your form links.
                </p>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Google Forms Setup Instructions" />
            <main className="mx-auto flex h-full max-w-4xl flex-1 flex-col p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-text-primary dark:text-dark-text-primary mb-3 text-3xl font-bold">Google Forms Automation Setup</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg leading-relaxed">
                        Follow these step-by-step instructions to automatically create Google Forms for your classroom. This process will generate
                        both teacher and student forms, plus a response collection sheet.
                    </p>
                </div>

                {/* Time estimate */}
                <div className="bg-primary-green/10 border-secondary-green/30 dark:bg-primary-green/20 dark:border-secondary-green/40 mb-8 rounded-lg border p-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="text-secondary-green h-5 w-5" />
                        <span className="text-primary-green dark:text-secondary-green font-medium">Estimated time: 10-15 minutes</span>
                    </div>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1 text-sm">
                        Most of this time is spent waiting for Google to process the script. The actual work takes just a few minutes.
                    </p>
                </div>

                {/* Main Instructions */}
                <div className="mb-12 space-y-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="border-light-border dark:border-dark-border bg-light-background dark:bg-dark-surface overflow-hidden rounded-lg border"
                        >
                            <div className="bg-light-surface dark:bg-dark-background border-light-border dark:border-dark-border border-b px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-primary-green flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h2 className="text-text-primary dark:text-dark-text-primary text-xl font-semibold">{step.title}</h2>
                                        <p className="text-text-tertiary dark:text-dark-text-tertiary mt-1 text-sm">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-6">{step.content}</div>
                        </div>
                    ))}
                </div>

                {/* Alternative Method */}
                <div className="border-light-border dark:border-dark-border border-t pt-8">
                    <h2 className="text-text-primary dark:text-dark-text-primary mb-4 text-2xl font-bold">
                        Alternative Method: Starting from Google Forms
                    </h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                        If you're more comfortable starting from Google Forms interface, you can use this alternative approach:
                    </p>

                    <div className="space-y-6">
                        {alternativeMethod.map((step, index) => (
                            <div
                                key={index}
                                className="bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border rounded-lg border p-6"
                            >
                                <h3 className="text-text-primary dark:text-dark-text-primary mb-3 text-lg font-semibold">
                                    Alternative Step {index + 1}: {step.title}
                                </h3>
                                {step.content}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-destructive/10 border-destructive/30 dark:bg-destructive/20 dark:border-destructive/40 mt-8 rounded-lg border p-6">
                    <h3 className="text-destructive mb-3 text-lg font-semibold">Need Help?</h3>
                    <div className="text-text-secondary dark:text-dark-text-secondary space-y-2">
                        <p>If you encounter any issues:</p>
                        <ul className="ml-4 list-inside list-disc space-y-1">
                            <li>Make sure you're signed into the correct Google account</li>
                            <li>Check that you have permission to create files in Google Drive</li>
                            <li>Ensure you've copied the entire script code without any missing parts</li>
                            <li>Try refreshing the page and running the script again if it doesn't work the first time</li>
                        </ul>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};

export default GoogleFormExportInstructions;
