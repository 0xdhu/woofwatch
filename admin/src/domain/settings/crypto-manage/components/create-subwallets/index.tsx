import { useState } from "react"
import CurrentStocks from "./current-stocks"

import Section from "../../../../../components/organisms/section"
import InputField from "../../../../../components/molecules/input"
import Button from "../../../../../components/fundamentals/button"
import useNotification from "../../../../../hooks/use-notification"
import { useCurrentStocks } from "../../../../../services/crypto.service";
import useToggleState from "../../../../../hooks/use-toggle-state"

import { sendRequestSubwalletsCreation } from "../../../../../services/crypto.service"
import AuthModal from "../auth-modal"

const getValue = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ?? ""

const getNumber = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ? parseInt(e.target.value) : 0

const CreateSubwallets = () => {
    const [mnemonic, setMnemonic] = useState("");
    const [counter, setCounter] = useState(0);
    const {
        open: openAuthModal,
        close: closeAuthModal,
        state: authModalOpen,
    } = useToggleState(false)

    const notification = useNotification();

    const { isLoading, data, refetch } = useCurrentStocks();

    const submitRequest = async () => {
        const subResult = await sendRequestSubwalletsCreation(mnemonic, counter);
        if (subResult !== "success") {
            notification("Error", subResult, "error");
            openAuthModal();
            return;
        }
        notification("Success", `New ${counter} of sub-wallets has been created!`, "success");
        refetch();
    }
    return (
        <>
        <Section>
            <div className="flex flex-col grow h-full">
                <div className="w-full flex flex-col grow">
                    <h3 className="inter-large-semibold mb-2xsmall">Create sub-wallets</h3>
                    <CurrentStocks stocks={ isLoading ? 'Loading': data }/>
                </div>
                <div className="flex flex-col mt-5 gap-y-small group-radix-state-open:mt-5 accordion-margin-transition">
                    <InputField
                        label="Mnemonic"
                        placeholder="genius student paddle ... airport filter satisfy"
                        tooltipContent="Note: if you already store your mnemonic in backend, this field is optional"
                        onChange={(e) => setMnemonic(getValue(e))}
                    />
                    <InputField
                        label="Count to create"
                        placeholder="1000"
                        type={"number"}
                        onChange={(e) => setCounter(getNumber(e))}
                    />

                    <Button
                        variant="secondary"
                        size="medium"
                        className="w-full rounded-rounded"
                        onClick={submitRequest}
                    >
                        Send request
                    </Button>
                </div>
            </div>
        </Section>
        {authModalOpen && (
            <AuthModal
              title="Authentication"
              handleClose={() => closeAuthModal()}
              notifyAuthPassed={submitRequest}
            />
        )}
        </>
    )
}

export default CreateSubwallets;
