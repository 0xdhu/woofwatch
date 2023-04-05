import { useState } from "react"
import { useAdminCreateBatchJob } from "medusa-react"

import Section from "../../../../../components/organisms/section"
import InputField from "../../../../../components/molecules/input"
import Button from "../../../../../components/fundamentals/button"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { sendPriceChange, useTokenMetadata, useTokenPrice } from "../../../../../services/crypto.service"
import AuthModal from "../auth-modal"

const getNumber = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ? parseFloat(e.target.value) : 0

const PriceOracle = () => {
    const [price, setPrice] = useState<number>();
    const notification = useNotification();
    const { isLoading, data, refetch } = useTokenPrice();
    const { isLoading: metdataLoading, data: metadata } = useTokenMetadata();

    const {
        open: openAuthModal,
        close: closeAuthModal,
        state: authModalOpen,
    } = useToggleState(false)
    const createBatchJob = useAdminCreateBatchJob()

    const submitRequest = async () => {
        if (!price || price <= 0) {
            notification("Error", "Wrong price!", "error");
            return;
        }

        const res = await sendPriceChange(price);
        if (res !== "success") {
            notification("Error", res, "error");

            openAuthModal();
            return;
        }
        refetch();
        notification("Success", `Price has been successfully updated!`, "success");
    }

    return (
        <>
        <Section>
            <div className="flex flex-col grow h-full">
                <div className="w-full flex flex-col grow">
                    <h3 className="inter-large-semibold mb-2xsmall">Change credential</h3>
                </div>
                <div className="flex flex-col mt-5 gap-y-small group-radix-state-open:mt-5 accordion-margin-transition">
                    <div className="flex inter-small-semibold text-grey-50 gap-x-1 items-center">
                        <label>Current { !metdataLoading && metadata && metadata.symbol } price: {isLoading ? "Loading" : `${data ?? 0}`}</label>
                    </div>
                    <InputField
                        label="New price"
                        placeholder="0.2"
                        type={"number"}
                        prefix={"$"}
                        onChange={(e) => setPrice(getNumber(e))}
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        className="w-full rounded-rounded"
                        onClick={submitRequest}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </Section>
        {authModalOpen && (
            <AuthModal
              title="Authentication"
              handleClose={() => closeAuthModal()}
              loading={createBatchJob.isLoading}
              notifyAuthPassed={submitRequest}
            />
        )}
        </>
    )
}

export default PriceOracle;
