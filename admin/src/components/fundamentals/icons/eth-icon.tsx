import React from "react"
import IconProps from "./types/icon-type"

const EthIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      x="0px" y="0px"
      {...attributes}
    >
        <polygon fill="#463f7c" points="249.982,6.554 397.98,251.112 250.53,188.092"/>
        <polygon fill="#a1a0b3" points="102.39,251.112 249.982,6.554 250.53,188.092"/>
        <polygon fill="#1c1944" points="249.982,341.285 102.39,251.112 250.53,188.092"/>
        <polygon fill="#0f0c26" points="397.98,251.112 250.53,188.092 249.982,341.285"/>
        <polygon fill="#3b3475" points="249.982,372.329 397.98,284.597 249.982,493.13"/>
        <polygon fill="#a5a3b5" points="249.982,372.329 102.39,284.597 249.982,493.13"/>
    </svg>
  )
}

export default EthIcon
