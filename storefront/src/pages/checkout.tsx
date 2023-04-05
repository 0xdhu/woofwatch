import useIpFilter from "@lib/hooks/use-ip-filter"
import CheckoutTemplate from "@modules/checkout/templates"
import Head from "@modules/common/components/head"
import NotFound from "./404";

const Checkout = () => {
  const [ipStatus ] = useIpFilter();
  if (ipStatus === "none") {
    return <></>
  }
  if (ipStatus === "denied") {
    return <NotFound />
  }
  return (
    <>
      <Head title="Checkout" />
      <CheckoutTemplate />
    </>
  )
}

export default Checkout
