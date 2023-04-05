import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import Button from "../../fundamentals/button";

type Props = {
  path: string
  label?: string
  className?: string
}

const AnchorButton = ({ path, label = "Go back", className }: Props) => {
  const navigate = useNavigate()
  return (
    <Button variant="secondary" size="small" onClick={()=>navigate(path)} className={clsx("py-xsmall", className)}>
        {label}
    </Button>
  )
}

export default AnchorButton
