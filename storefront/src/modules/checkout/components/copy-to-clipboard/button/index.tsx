import clsx from "clsx"
import React, { Children } from "react"

export type ButtonProps = {
  variant: "primary" | "secondary" | "ghost" | "danger" | "nuclear"
  size?: "small" | "medium" | "large"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "large",
      children,
      ...attributes
    },
    ref
  ) => {
    const handleClick = (e: any) => {
      if (attributes.onClick) {
        attributes.onClick(e)
      }
    }

    const variantClassname = clsx({
      ["btn-primary"]: variant === "primary",
      ["btn-secondary"]: variant === "secondary",
      ["btn-ghost"]: variant === "ghost",
      ["btn-danger"]: variant === "danger",
      ["btn-nuclear"]: variant === "nuclear",
    })

    const sizeClassname = clsx({
      ["btn-large"]: size === "large",
      ["btn-medium"]: size === "medium",
      ["btn-small"]: size === "small",
    })

    return (
      <button
        {...attributes}
        className={clsx(
          "btn",
          variantClassname,
          sizeClassname,
          attributes.className
        )}
        disabled={attributes.disabled}
        ref={ref}
        onClick={handleClick}
      >
        {
          Children.map(children, (child, i) => {
            return (
              <span key={i} className="mr-xsmall last:mr-0">
                {child}
              </span>
            )
          })
        }
      </button>
    )
  }
)

Button.displayName = "button-copy"; // add displayName property

export default Button
