import { useTokenMetadata, useTokenPrice } from "../../../../../services/crypto.service";
import TokenInfoItem from "./info-item";

const TokenInfoContainer = () => {
    const { isLoading, isError, data } = useTokenMetadata();
    const { isLoading: priceLoading, data: price } = useTokenPrice();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      return <div>Error: something went wrong</div>;
    }
  
    return (
        <>
            { data && <TokenInfoItem title={"Token symbol"} content={data.symbol}/> }
            { data && <TokenInfoItem title={"Token decimal"} content={data.decimal}/> }
            { data && <TokenInfoItem title={"Token address"} content={
            <a
                href={`${data.etherscan}`}
                rel="noreferrer noopener"
                target="_blank"
                className="text-grey-50 hover:cursor-pointer hover:underline"
            >
                {data.address}
            </a>
            }/> }
            { data && <TokenInfoItem title={"Token price"} content={
                priceLoading ? "loading...": `$${price ?? 0}`
            }/> }
        </>
    )
}

export default TokenInfoContainer
