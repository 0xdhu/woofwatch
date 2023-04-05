import moment from "moment"
import { useMemo } from "react"
import { getColor } from "../../../../../utils/color"
import Tooltip from "../../../../../components/atoms/tooltip"
import StatusDot from "../../../../../components/fundamentals/status-indicator"
import CustomerAvatarItem from "../../../../../components/molecules/customer-avatar-item"
import ImagePlaceholder from "../../../../../components/fundamentals/image-placeholder"

const useSaleTableColums = (singleWithdraw) => {
    const columns = useMemo(
        () => [
            {
                Header: <div className="pl-2">Sale</div>,
                accessor: "display_id",
                Cell: ({ cell: { value } }) => (
                    <p className="text-grey-90 cursor-pointer group-hover:text-violet-60 min-w-[20px] pl-2">{`#${value}`}</p>
                ),
            },
            {
                Header: "Product",
                accessor: "product_items",
                Cell: ({ row: { original } }) => {
                    const { product_items } = original
                    return (
                    <div className="flex flex-col items-start cursor-pointer">
                        {
                            product_items.map((item, index) => {
                                const { thumbnail, title} = item;
                                return (
                                    <div className="flex items-center" key={`${index}`}>
                                        <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail}
                                                    className="h-full object-cover rounded-soft"
                                                />
                                            ) : (
                                                <ImagePlaceholder />
                                            )}
                                        </div>
                                        {title}
                                    </div>
                                )
                            })
                        }
                    </div>
                )},
            },
            {
                Header: "Date funded",
                accessor: "created_at",
                Cell: ({ cell: { value } }) => (
                    <div className="cursor-pointer">
                        <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
                        {moment(value).format("DD MMM YYYY")}
                        </Tooltip>
                    </div>
                ),
            },
            {
                Header: "Customer",
                accessor: "customer",
                Cell: ({ row, cell: { value } }) => (
                    <div className="cursor-pointer">
                        <CustomerAvatarItem
                            customer={{
                                email: value,
                            }}
                            color={getColor(row.index)}
                        />
                    </div>
                ),
            },
            {
                Header: "Fiat value",
                accessor: "fiat",
                Cell: ({ cell: { value } }) => (
                    <div className="cursor-pointer">
                        {value}
                    </div>
                ),
            },
            {
                Header: "Payment status",
                accessor: "payment_status",
                Cell: ({ cell: { value } }) => (<StatusDot className="cursor-pointer" variant="success" title={value} />),
            },
            {
                Header: "Sub-wallet",
                accessor: "sub_wallet",
                Cell: ({ cell: { value } }) => (
                    <div className="cursor-pointer">
                        {value ?? "N/A"}
                    </div>
                ),
            },
            {
                Header: () => <div className="text-right">Total</div>,
                accessor: "total",
                Cell: ({ cell: { value } }) => (
                    <div className="text-right cursor-pointer">
                        {value}
                    </div>
                ),
            },
            {
                Header: () => <div className="text-right">Action</div>,
                accessor: "action",
                Cell: ({ cell: { value } }) => (
                    <div className="text-right text-blue-600 cursor-pointer" onClick={async () => singleWithdraw(value.address, value.payAmount)}>
                        Withdraw
                    </div>
                ),
            },
        ],
        []
    )

    return [columns]
}

export default useSaleTableColums
