import React, { useState } from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import InputField from "../../../../../components/molecules/input"
import useNotification from "../../../../../hooks/use-notification"
import { sendRequestAccessToken } from "../../../../../services/crypto.service"

type AuthModalProps = {
    handleClose: () => void
    notifyAuthPassed: ()=>void
    title: string
}
const getValue = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ?? ""

const AuthModal: React.FC<AuthModalProps> = ({
    handleClose,
    notifyAuthPassed,
    title,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const notification = useNotification();
    const [loading, setLoading] = useState<boolean>(false);

    const submitRequest = async () => {
        if (email === "") {
            notification("Error", "Please put your email", "error");
        }
        if (password === "") {
            notification("Error", "Please put your password", "error");
        }
        setLoading(true);
        
        try {
            const tokenResult = await sendRequestAccessToken(email, password);
            if (tokenResult !== "success") {
                notification("Error", tokenResult, "error");
                return;
            }
            
            notification("Success", `Authentication has been passed successfully!`, "success");
            notifyAuthPassed();
            handleClose();
        } catch (err) {}

        setLoading(false);
    }
    
    return (
        <Modal handleClose={handleClose}>
        <Modal.Body>
            <Modal.Header handleClose={handleClose}>
                <span className="inter-xlarge-semibold">{title}</span>
            </Modal.Header>
            <Modal.Content>
                <div className="flex mb-4 inter-small-regular text-grey-50">
                    Note: you need to authorize on crypto payment gateway to access sensitive data.
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
                    disabled={loading}
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
