const TokenInfoItem = ({title, content}) => {
    return (
      <p className="text-grey-50 inter-base-regular mt-2xsmall">
        {title}: {content}
      </p>
    )
}

export default TokenInfoItem;
