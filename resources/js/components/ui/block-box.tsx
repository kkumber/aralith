import { cn } from "@/lib/utils";


type Props = React.ComponentProps<'div'> & {
    className?: string
    item: string
}

const BlockBox = ({className, item, ...props}: Props) => {
    return ( 
        <div className={cn("p-3 rounded-md border hover:border-primary-green hover:cursor-pointer", className)} {...props}>
            <p>{item}</p>
        </div>
     );
}
 
export default BlockBox;