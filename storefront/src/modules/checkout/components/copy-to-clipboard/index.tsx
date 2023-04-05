import clsx from "clsx"
import React from "react"
import useClipboard from "./use-clipboard"
import Button from "./button"
import ClipboardCopyIcon from "@modules/common/icons/clipboard-copy"

type CopyToClipboardProps = {
  value: string
  displayValue?: string
  successDuration?: number
  showValue?: boolean
  onCopy?: () => void
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  displayValue,
  successDuration = 3000,
  showValue = true,
  onCopy = () => {},
}) => {
  const [isCopied, handleCopy] = useClipboard(value, {
    onCopied: onCopy,
    successDuration: successDuration,
  })

  return (
    <div className="inter-small-regular flex items-center gap-x-xsmall text-grey-50">
      {showValue && (
        <span className="w-full truncate">
          {displayValue ? displayValue : value}
        </span>
      )}
      <Button
        variant="ghost"
        size="small"
        type="button"
        className={clsx("p-0 text-grey-50", {
          ["text-violet-60"]: isCopied,
        })}
        onClick={handleCopy}
      >
        <ClipboardCopyIcon size={24}/>
      </Button>
    </div>
  )
}

export default CopyToClipboard
