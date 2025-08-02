// CodeBlock.tsx
import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const CodeBlock = ({ 
  children, 
  language = 'javascript', 
  title = '',
  collapsible = true,
  defaultCollapsed = false
}: CodeBlockProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      toast.info('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  // Count lines to determine if collapse button should be shown
  const lineCount: number = children.split('\n').length;
  const shouldShowCollapseButton: boolean = collapsible && lineCount > 10;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {title && (
            <span className="text-sm font-medium text-foreground">{title}</span>
          )}
          {language && (
            <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-mono">
              {language}
            </span>
          )}
          {lineCount > 1 && (
            <span className="text-xs text-muted-foreground">
              {lineCount} lines
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {shouldShowCollapseButton && (
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              title={isCollapsed ? 'Expand code' : 'Collapse code'}
            >
              {isCollapsed ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>
          )}
          
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded-md transition-all duration-200 ${
              copied 
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <Check size={16} className="animate-pulse" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed && shouldShowCollapseButton ? 'max-h-32' : ''
          }`}
          style={!isCollapsed ? { maxHeight: 'none' } : {}}
        >
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-card text-foreground">
            <code className="font-mono">{children}</code>
          </pre>
        </div>
        
        {/* Fade overlay when collapsed */}
        {isCollapsed && shouldShowCollapseButton && (
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-card to-transparent"></div>
        )}
      </div>
      
      {/* Expand/Collapse footer button for better UX on long code blocks */}
      {shouldShowCollapseButton && (
        <div className="border-t border-border px-4 py-2 text-center bg-muted/30">
          <button
            onClick={toggleCollapse}
            className="text-sm px-3 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          >
            {isCollapsed ? (
              <>
                <ChevronDown size={14} className="inline mr-1" />
                Show all {lineCount} lines
              </>
            ) : (
              <>
                <ChevronUp size={14} className="inline mr-1" />
                Collapse
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;