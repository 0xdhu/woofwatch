import React, { useState } from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import InputField from "../../../../../components/molecules/input"
import useNotification from "../../../../../hooks/use-notification"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import { adminTokenKey, sendRequestAccessToken, sendRequestSingleWithdrawFunds, sendRequestWithdrawFunds } from "../../../../../services/crypto.service"



type AuthModalProps = {
    handleClose: () => void
    cb: () => void
    title: string
    total?: number | undefined | null
    note: string
    address?: string
}
const getValue = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ?? ""

const AuthModal: React.FC<AuthModalProps> = ({
    handleClose,
    title,
    total,
    address,
    note,
    cb
}) => {
    const [mnemonic, setMnemonic] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const notification = useNotification();

    const submitRequest = async () => {
        setLoading(true)
        try {
            const token = await localStorage.getItem(adminTokenKey);
            if ((!token || token === "") && !hidden) {
                if (email === "") {
                    notification("Error", "Please put your email", "error");
                }
                if (password === "") {
                    notification("Error", "Please put your password", "error");
                }
    
                const tokenResult = await sendRequestAccessToken(email, password);
                if (tokenResult !== "success") {
                    notification("Error", tokenResult, "error");
                    return;
                }
                setHidden(true)
            }
            const subResult = address ? await sendRequestSingleWithdrawFunds(address, mnemonic) : await sendRequestWithdrawFunds(mnemonic);
            if (subResult !== "success") {
                setHidden(false);
                notification("Error", subResult, "error");
                return;
            }
            notification("Success", `Total ${total} MXC token withdraw has been successfully completed!`, "success");
            cb()
            handleClose();
        } catch (err) {
            // 
        } finally {
            setLoading(false)

        }
    }
    
    return (
        <Modal handleClose={handleClose}>
        <Modal.Body>
            <Modal.Header handleClose={handleClose}>
                <span className="inter-xlarge-semibold">{title}</span>
            </Modal.Header>
            <Modal.Content>
                <div className="flex mb-4 inter-small-regular text-grey-50">
                    { note }
                </div>
                <div className="flex mb-4 inter-small-regular text-grey-50">
                    <InputField
                        label="Mnemonic"
                        placeholder="genius student paddle ... airport filter satisfy"
                        tooltipContent="Note: if you already store your mnemonic in backend, this field is optional. Your all funds will be transferred to the account of this mnemonic"
                        onChange={(e) => setMnemonic(getValue(e))}
                    />
                </div>
                { !hidden && <>
                    <div className="flex gap-x-1 inter-small-semibold mb-2 items-center">
                        <span> authorize to withdraw </span>
                        <IconTooltip content="This requires due to security reason that might cause the access of your funds" />
                    </div>
                    <div className="flex gap-x-small mb-4 inter-small-regular text-grey-50">
                        <InputField
                            label="Email"
                            required
                            placeholder="erc-payment@store.com"
                            onChange={(e) => setEmail(getValue(e))}
                        />


                        <InputField
                            label="Password"
                            type="password"
                            required
                            onChange={(e) => setPassword(getValue(e))}
                        />
                    </div>
                </> }
            </Modal.Content>
            <Modal.Footer>
            <div className="w-full flex justify-end">
                <Button
                    variant="ghost"
                    size="small"
                    onClick={handleClose}
                    className="mr-2"
                >
                    Cancel
                </Button>
                <Button
                    loading={loading}
                    disabled={loading || total == 0}
                    variant="primary"
                    size="small"
                    onClick={submitRequest}
                >
                    Submit
                </Button>
            </div>
            </Modal.Footer>
        </Modal.Body>
        </Modal>
    )
}

export default AuthModal
