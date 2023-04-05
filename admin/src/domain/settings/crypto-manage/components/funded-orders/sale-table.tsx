import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import Table from "../../../../../components/molecules/table"
import TableContainer from "../../../../../components/organisms/table-container"
import useSaleTableColums from "./table-column"
import useToggleState from "../../../../../hooks/use-toggle-state"
import AuthModal from "./auth-modal"

const DEFAULT_PAGE_SIZE = 30

const SaleTable = ({ orders, isLoading, cb }) => {
    const offs = 0;
    const lim = DEFAULT_PAGE_SIZE;

    const [numPages, setNumPages] = useState(0)
    const [subwallet, setSubwallet] = useState<string>("")
    const [withdrawAmount, setWithdrawAmount] = useState(0)

    const {
        open: openAuthModal,
        close: closeAuthModal,
        state: authModalOpen,
    } = useToggleState(false)

    // useEffect(() => {
    //     const controlledPageCount = Math.ceil(count! / queryObject.limit)
    //     setNumPages(controlledPageCount)
    // }, [data])

    const withdrawFromSubwallet = (subaddress, withdraw_amount) => {
        setSubwallet(subaddress);
        setWithdrawAmount(withdraw_amount);
        openAuthModal();
    }

    const [columns] = useSaleTableColums(withdrawFromSubwallet)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        // Get the state from the instance
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data: orders || [],
            manualPagination: true,
            initialState: {
                pageSize: lim,
                pageIndex: offs / lim,
            },
            pageCount: numPages,
            autoResetPage: false,
        },
        usePagination
    )

    const handleNext = () => {
        if (canNextPage) {
        //   paginate(1)
        nextPage()
        }
    }

    const handlePrev = () => {
        if (canPreviousPage) {
        //   paginate(-1)
        previousPage()
        }
    }
    return (
        <div>
        <TableContainer
            isLoading={isLoading}
            hasPagination
            numberOfRows={lim}
            pagingState={{
                count: 5, // count!,
                offset: offs,
                pageSize: offs + rows.length,
                title: "Sales",
                currentPage: pageIndex + 1,
                pageCount: pageCount,
                nextPage: handleNext,
                prevPage: handlePrev,
                hasNext: canNextPage,
                hasPrev: canPreviousPage,
            }}
        >
            <Table
                // enableSearch
                // handleSearch={setQuery}
                // searchValue={query}
                {...getTableProps()}
                className={clsx({ ["relative"]: isLoading })}
            >
                <Table.Head>
                    {headerGroups?.map((headerGroup) => (
                        <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((col) => (
                            <Table.HeadCell {...col.getHeaderProps()}>
                                {col.render("Header")}
                            </Table.HeadCell>
                            ))}
                        </Table.HeadRow>
                    ))}
                </Table.Head>
                <Table.Body {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        const { order_id } = (row.original as Record<string, string>);
                        return (
                            <Table.Row
                                color={"inherit"}
                                {...row.getRowProps()}
                                className="group"
                            >
                                {row.cells.map((cell) => {
                                    return cell.column.id !== "action" ? (
                                        <Table.Cell linkTo={ order_id } {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </Table.Cell>
                                    ) : (
                                        <Table.Cell {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </Table.Cell>
                                    )
                                })}
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        </TableContainer>

        {authModalOpen && (
            <AuthModal
              title="Withdraw fund"
              total={withdrawAmount}
              address={subwallet}
              handleClose={() => closeAuthModal()}
              cb={cb}
              note={ `Note: you are going to withdraw ${withdrawAmount} MXC token from sub-wallet ${subwallet}.`}
            />
          )}
        </div>
    )
}

export default React.memo(SaleTable)
