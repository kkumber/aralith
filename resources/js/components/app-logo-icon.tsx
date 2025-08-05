import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* HEAD */}
            <circle cx="256" cy="100" r="40" />

            {/* TORSO / BODY */}
            <path d="M226 150 Q256 200 286 150 Q270 210 256 230 Q242 210 226 150 Z" />

            {/* MOUNTAIN */}
            <path
                d="M96 400 
               L190 240 
               L240 320 
               L256 300 
               L272 320 
               L322 240 
               L416 400 
               Z"
            />

            {/* Snow caps or light lines on peaks (optional accents) */}
            <path d="M190 240 L216 280 L190 Z" fill="white" />
            <path d="M322 240 L296 280 L322 Z" fill="white" />
        </svg>
    );
}
