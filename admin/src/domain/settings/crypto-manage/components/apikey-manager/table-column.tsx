import moment from "moment"
import { useMemo } from "react"
import Tooltip from "../../../../../components/atoms/tooltip"
import CopyToClipboard from "../../../../../components/atoms/copy-to-clipboard"
import { getEllipsisTxt, sendAPIKeyDelete } from "../../../../../services/crypto.service"
import useNotification from "../../../../../hooks/use-notification"

const useKeyTableColums = (cb) => {
    const notification = useNotification();

    const columns = useMemo(
        () => [
            {
                Header: <div className="pl-2">Sale</div>,
                accessor: "display_id",
                Cell: ({ cell: { value } }) => (
                    <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
                ),
            },
            {
                Header: "Created at",
                accessor: "created_at",
                Cell: ({ cell: { value } }) => (
                    <div>
                        <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
                        {moment(value).format("DD MMM YYYY")}
                        </Tooltip>
                    </div>
                ),
            },
            {
                Header: "Client ID",
                accessor: "client_id",
                Cell: ({ cell: { value } }) => (<CopyToClipboard value={value} displayValue={value} iconSize={14} />),
            },
            {
                Header: "Secret Key",
                accessor: "secret_key",
                Cell: ({ cell: { value } }) => (<CopyToClipboard value={value} displayValue={getEllipsisTxt(value)} iconSize={14} />),
            },
            {
                Header: () => <div className="text-right">Action</div>,
                accessor: "action",
                Cell: ({ cell: { value } }) => (
                    <div className="text-right text-red-600 cursor-pointer" onClick={async () => {
                        const result = await sendAPIKeyDelete(value);
                        if (result === "success") {
                            notification("Success", `API key ${getEllipsisTxt(value)}has been deleted successfully!`, "success");
                            cb();
                        } else {
                            notification("Error", result, "error");
                        }
                    }}>
                        Remove
                    </div>
                ),
            },
        ],
        []
    )

    return [columns]
}

export default useKeyTableColums
