import React from "react"
import { IconProps } from "types/icon"

const ClipboardCopyIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
    return (        
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...attributes}>
            <rect x="7" y="5" width="12" height="14" rx="2" ry="2"/>
            <rect x="10" y="3" width="7" height="4" rx="1" ry="1"/>
        </svg>
    )
}

export default ClipboardCopyIcon
