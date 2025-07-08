interface DashedLoadingProps {
    mainContent?: string,
    subContent?: string,
}

const DashedLoading = ({mainContent, subContent}: DashedLoadingProps) => {
    return ( 
        <div className="text-center">
            <div className="border-primary-green mx-auto h-8 w-8 animate-spin rounded-full border-4 border-dashed"></div>
            <p className="mt-4 text-zinc-900 dark:text-white">{mainContent}</p>
            <p className="text-zinc-600 dark:text-zinc-400">{subContent}</p>
        </div>
     );
}
 
export default DashedLoading;