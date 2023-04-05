import { Route, Routes } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Section from "../../../components/organisms/section"
import TokenInfoContainer from "./components/token-info";
import AnchorButton from "../../../components/atoms/anchor-button";
import FundedOrderHistory from "./components/funded-orders";
import CreateSubwallets from "./components/create-subwallets";
import ChangeCredentials from "./components/change-credential";
import APIKeyManager from "./components/apikey-manager";
import PriceOracle from "./components/oracle";
import Details from "../../orders/details";

const CryptoPaymentHeader = () => {
  return (
    <div className="pb-xlarge">
      <BackButton
        label="Back to Settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <Section>
        <div className="mb-large">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-y-1">
              <h3 className="inter-large-semibold mb-2xsmall">ERC20 Payment Gateway</h3>
              <TokenInfoContainer />
              <AnchorButton label="Change price" path="/a/settings/crypto-manage/oracle"/>
            </div>
            <div className="flex flex-col gap-y-1">
              <AnchorButton label="Change credential" path="/a/settings/crypto-manage/change-credential"/>
              <AnchorButton label="Generate API Key" path="/a/settings/crypto-manage/apikey"/>
              <hr className="my-1"/>
              <AnchorButton label="Create sub-wallets" path="/a/settings/crypto-manage/create-subwallets"/>
              <AnchorButton label="View funded wallets" path="/a/settings/crypto-manage"/>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

const CryptoManage = () => {
  return (
    <>
      <CryptoPaymentHeader />
      <Routes>
        <Route index element={<FundedOrderHistory />} />
        <Route path="/create-subwallets" element={<CreateSubwallets />} />
        <Route path="/change-credential" element={<ChangeCredentials />} />
        <Route path="/apikey" element={<APIKeyManager />} />
        <Route path="/oracle" element={<PriceOracle />} />
        <Route path="/:id" element={<Details prevPath={"/a/settings/crypto-manage"}/>} />
      </Routes>
    </>
  )
}

export default CryptoManage
