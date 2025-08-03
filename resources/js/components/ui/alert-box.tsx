import { AlertCircle } from 'lucide-react';

interface AlertBoxProps {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
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

export default AlertBox;