
import Section from "../../../../../components/organisms/section"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { sendAPIKeyRequest, useAPIKeyList } from "../../../../../services/crypto.service"
import Button from "../../../../../components/fundamentals/button"
import BodyCard from "../../../../../components/organisms/body-card"
import TableViewHeader from "../../../../../components/organisms/custom-table-header"
import useToggleState from "../../../../../hooks/use-toggle-state"
import useNotification from "../../../../../hooks/use-notification"
import KeyTable from "./key-table"
import AuthModal from "../auth-modal"
import KeyIcon from "../../../../../components/fundamentals/icons/key-icon"

const VIEWS = ["sales"]

const APIKeyManager = () => {
    const view = "sales"
    const [isAuthed, setIsAuthed] = useState<boolean>(true);
    const navigate = useNavigate()
    const notification = useNotification();

    const { data, isLoading, refetch } = useAPIKeyList();

    const {
        open: openAuthModal,
        close: closeAuthModal,
        state: authModalOpen,
    } = useToggleState(false)

    useEffect(() => {
        if (!isLoading) {
            if (data === "InvalidToken" && !authModalOpen) {
                openAuthModal();
                setIsAuthed(false);
                return;
            } 
            if (data !== "InvalidToken" && authModalOpen) {
                closeAuthModal();
                setIsAuthed(false);
                return;
            }
            setIsAuthed(true);
        }
    }, [data, isLoading]);

    const notifyAuthPassed = () => {
        refetch();
        setIsAuthed(true);
    }

    const actions = useMemo(() => {
        return [
        <Button
            variant="secondary"
            size="small"
            onClick={async () => {
                const result = await sendAPIKeyRequest()
                if (result === "success") {
                    refetch();
                    notification("Success", `API key has been created successfully!`, "success");
                } else {
                    notification("Error", result, "error");
                }
            }}
        >
            <KeyIcon size={20} />
            Create a key
        </Button>,
        ]
    }, [view])

    return (
        <>
        <Section>
            <div className="flex flex-col grow h-full">
                <div className="w-full flex flex-col grow">
                    <h3 className="inter-large-semibold mb-2xsmall">API keys</h3>
                </div>
            </div>
            <div className="flex flex-col grow h-full">
                {/* {!isAuthed && ( */}
                    <div className="inter-base-regular text-grey-50">
                        Note: you need to authorize on crypto payment gateway to access sensitive data. 
                        Click <span className="text-blue-800 cursor-pointer" onClick={openAuthModal}>here</span> to sign in.
                    </div>
                {/* )} */}
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
                    { data !== "InvalidToken" && <KeyTable orders={ data } isLoading={ isLoading } cb={refetch}/> }
                </BodyCard>
                </div>
            </div>
        </Section>
        {authModalOpen && (
            <AuthModal
              title="Authentication"
              handleClose={() => closeAuthModal()}
              notifyAuthPassed={notifyAuthPassed}
            />
        )}
        </>
    )
}

export default APIKeyManager;
