import React from "react";

type Props = {
  params: {
    address: string;
  };
};

const InteractContractAddress: React.FC<Props> = ({ params: { address } }) => {
  return <div>{address}</div>;
};

export default InteractContractAddress;
