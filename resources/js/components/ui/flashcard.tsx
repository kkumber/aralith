import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


type Props = React.ComponentProps<"div"> & {
    className?: string;
    frontcard: string;
    backcard: string;
}
const Flashcard = ({className, frontcard, backcard, ...props}: Props) => {
    const [flipped, setFlipped] = useState(false);

    return ( 
        <div className={cn("p-4 rounded-lg shadow-md border hover:border-primary-green hover:cursor-pointer text-center ", className)} {...props} onClick={() => setFlipped(!flipped)}>

        {!flipped ? (
            // Front
            <div className="flex flex-col">
                <p className="my-20"><b>{frontcard}</b></p>
                <div className="flex gap-2 items-center justify-center">
                    <small>Click to reveal answer </small>
                    <Eye className="text-primary" size={15}/>
                </div>
            </div>
        ): (
            // Back
            <div className="flex flex-col">
                <p className="my-20">{backcard}</p>
                <div className="flex gap-2 items-center justify-center">
                    <small>Click to hide answer </small>
                    <EyeOff className="text-primary" size={15}/>
                </div>
            </div>)}
            

            
        </div>
     );
}
 
export default Flashcard;