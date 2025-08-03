import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

import AlertBox from '@/components/ui/alert-box';
import StepCard from '@/components/ui/step-card';
import { alternativeSteps, getMainSteps } from './data/stepData';

const GoogleFormExportInstructions = () => {
    const { script } = usePage<{ script: string }>().props;
    const [showAlternative, setShowAlternative] = useState(false);

    const steps = getMainSteps(script);

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

                {/* Main Instructions */}
                <div className="space-y-6">
                    <h2 className="text-center">Main Instructions</h2>
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} index={index} />
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
