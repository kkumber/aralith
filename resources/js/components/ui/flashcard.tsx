import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = React.ComponentProps<"div"> & {
    className?: string;
    frontcard: string;
    backcard: string;
}
const Flashcard = ({className, frontcard, backcard, ...props}: Props) => {
    const [flipped, setFlipped] = useState(false);

    return ( 
        <div className={cn("p-3 rounded-md border hover:border-primary-green hover:cursor-pointer", className)} {...props} onClick={() => setFlipped(!flipped)}>
            {flipped ? (<p>{backcard}</p>) : (<p>{frontcard}</p>)}
        </div>
     );
}
 
export default Flashcard;