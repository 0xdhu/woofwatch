import { useState } from "react"

import Section from "../../../../../components/organisms/section"
import InputField from "../../../../../components/molecules/input"
import Button from "../../../../../components/fundamentals/button"
import useNotification from "../../../../../hooks/use-notification"
import Switch from "../../../../../components/atoms/switch"

import { sendCredentialUpdates } from "../../../../../services/crypto.service"

const getValue = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value ?? ""

const ChangeCredentials = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [hidden, setHidden] = useState(true);

    const notification = useNotification();

    const submitRequest = async () => {
        if (email === "") {
            notification("Error", "Please put your current email", "error");
        }
        if (password === "") {
            notification("Error", "Please put your current password", "error");
        }
        if (newPassword === "") {
            notification("Error", "Please put your new password", "error");
        }

        const res = await sendCredentialUpdates(email, password, hidden ? "" : newEmail, newPassword);
        if (res !== "success") {
            notification("Error", res, "error");
            return;
        }
        notification("Success", `Your credential has been successfully updated!`, "success");
    }
    return (
      <Section>
          <div className="flex flex-col grow h-full">
            <div className="w-full flex flex-col grow">
                <h3 className="inter-large-semibold mb-2xsmall">Change credential</h3>
            </div>
            <div className="flex flex-col mt-5 gap-y-small group-radix-state-open:mt-5 accordion-margin-transition">
                <InputField
                    label="Current email"
                    placeholder="erc-payment@store.com"
                    onChange={(e) => setEmail(getValue(e))}
                />
                <InputField
                    label="Current password"
                    type="password"
                    required
                    onChange={(e) => setPassword(getValue(e))}
                />
                <div className="flex inter-small-semibold text-grey-50 gap-x-1 items-center">
                    <label>Do you want to change current email as well?</label>
                    <Switch checked={!hidden} onCheckedChange={()=> setHidden(!hidden)}/>
                </div>
                {
                    !hidden && 
                    <InputField
                        label="New email"
                        tooltipContent="This is optional."
                        placeholder="erc-payment@store.com"
                        onChange={(e) => setNewEmail(getValue(e))}
                    />
                }

                <InputField
                    label="New password"
                    type="password"
                    required
                    onChange={(e) => setNewPassword(getValue(e))}
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
    )
}

export default ChangeCredentials;
