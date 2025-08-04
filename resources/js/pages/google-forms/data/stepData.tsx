import AlertBox from '@/components/ui/alert-box';
import CodeBlock from '@/components/ui/code-block';
import { AlertCircle, CheckCircle, Download, ExternalLink, Play } from 'lucide-react';

export interface StepData {
    title: string;
    description: string;
    content: React.ReactNode;
    estimatedTime?: string;
}

export const getMainSteps = (script: string): StepData[] => [
    {
        title: 'Copy the Script Code',
        description: 'Get the automated script that will create your Google Forms',
        estimatedTime: '1 minute',
        content: (
            <div className="space-y-4">
                <p>Click the code block below to expand it, then copy all the code. You'll paste this into Google Apps Script in the next steps.</p>

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
                    Once you're on the Google Apps Script homepage, click the <strong>New Project</strong> button. This will open the script editor
                    with a blank project.
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
                    The script editor will open with some default code. Select all the existing code (Ctrl+A or Cmd+A) and delete it, then paste the
                    code you copied from Step 1.
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
                    Save your project by pressing <kbd className="bg-muted border-border rounded border px-2 py-1 font-mono text-sm">Ctrl + S</kbd>{' '}
                    (or <kbd className="bg-muted border-border rounded border px-2 py-1 font-mono text-sm">Cmd + S</kbd> on Mac) or clicking the save
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
                    permission to access your Google Drive and Forms. Allow all permissions.
                </p>

                <AlertBox type="info" title="Authorization Required" icon={<Play className="h-5 w-5" />}>
                    Google will show a security warning because this is a custom script. Click "Review permissions" then log-in to your google account
                    to proceed. This is normal and safe for scripts you create yourself.
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
                    After the script runs successfully, check the <strong>execution log</strong> (usually at the bottom of the screen). You'll find
                    links to your newly created Google Forms and the response collection sheet.
                </p>

                <AlertBox type="success" title="What You'll Get" icon={<CheckCircle className="h-5 w-5" />}>
                    <ul className="mt-2 space-y-1">
                        <li>• Teacher form link (you may need to configure form settings)</li>
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

export const alternativeSteps = [
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
                From here, follow steps 4-8 from the main instructions above to paste your code, save the project, run the script, and collect your
                form links.
            </p>
        ),
    },
];
