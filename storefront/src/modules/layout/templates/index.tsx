import useIpFilter from "@lib/hooks/use-ip-filter"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React from "react"
import Head from "@modules/common/components/head"

const Layout: React.FC = ({ children }) => {
  const [ipStatus ] = useIpFilter();
  if (ipStatus === "none") {
    return <></>
  }
  if (ipStatus === "denied") {
    return <RestrictPage />
  }
  return (
    <div>
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

const RestrictPage = () => {
  return (
    <>
      <Head title="404" description="Something went wrong" />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl-semi text-gry-900">Page not found</h1>
        <p className="text-small-regular text-gray-700">
          The page you tried to access does not exist.
        </p>
      </div>
    </>
  )
}
export default Layout
