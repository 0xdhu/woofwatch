
import Section from "../../../../../components/organisms/section"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { useFundedWalletList } from "../../../../../services/crypto.service"
import Button from "../../../../../components/fundamentals/button"
import BodyCard from "../../../../../components/organisms/body-card"
import TableViewHeader from "../../../../../components/organisms/custom-table-header"
import useToggleState from "../../../../../hooks/use-toggle-state"
import SaleTable from "./sale-table"
import AuthModal from "./auth-modal"
import CoinsIcon from "../../../../../components/fundamentals/icons/coins-icon"

const VIEWS = ["sales"]

const FundedOrderHistory = () => {
    const view = "sales"

    const navigate = useNavigate()
    const { data, isLoading, refetch } = useFundedWalletList();

    const withdrawableNum = Math.min(data?.length ?? 0, 20);
    const total = data && data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.pay_amount;
    }, 0);

    const {
        open: openAuthModal,
        close: closeAuthModal,
        state: authModalOpen,
    } = useToggleState(false)
    
    const actions = useMemo(() => {
        return [
        <Button
            variant="secondary"
            size="small"
            onClick={() => openAuthModal()}
        >
            <CoinsIcon size={20} />
            Withdraw all ({withdrawableNum})
        </Button>,
        ]
    }, [view, data])

    return (
        <>
        <Section>
            <div className="flex flex-col grow h-full">
                <div className="w-full flex flex-col grow">
                    <h3 className="inter-large-semibold mb-2xsmall">Funded wallets</h3>
                </div>
            </div>
            <div className="flex flex-col grow h-full">
                <div className="w-full flex flex-col grow">
                <BodyCard
                    customHeader={
                        <TableViewHeader
                            views={VIEWS}
                            setActiveView={(v) => {
                                if (v === "drafts") {
                                    navigate(`/a/settings/crypto-manage/draft-orders`)
                                }
                            }}
                            activeView={view}
                        />
                    }
                    className="h-fit"
                    customActionable={actions}
                >
                    <SaleTable orders={ data } isLoading={ isLoading } cb={refetch}/>
                </BodyCard>
                </div>
            </div>
        </Section>
        {authModalOpen && (
            <AuthModal
              title="Withdraw funds"
              total={total}
              handleClose={() => closeAuthModal()}
              cb={refetch}
              note={ `Note: you can withdraw total ${total} MXC token from ${ withdrawableNum } sub-wallets. Max number is 20 sub-wallets per transaction.`}
            />
          )}
        </>
    )
}

export default FundedOrderHistory;
