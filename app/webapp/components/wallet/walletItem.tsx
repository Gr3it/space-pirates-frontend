"use client";

import { useAccount } from "wagmi";
import Image from "next/image";

type WalletItemProps = {
  title: string;
  list: {
    tokens: any[];
  };
};

const WalletItem = ({ title, list }: WalletItemProps) => {
  const { address, isConnected } = useAccount();
  console.log(address);

  return (
    <div className="lg:w-3/6 md:w-4/6 w-full collapse collapse-arrow border border-base-300 bg-base-100 rounded-box drop-shadow">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content ">
        {list.tokens.map((token, index) => (
          <div
            key={index}
            className="py-2 gap-y-4 md:gap-y-0 rounded-md drop-shadow-md flex flex-row justify-between items-center"
          >
            <div className="flex items-center">
              <Image
                src={"logoURI" in token ? token.logoURI : "/favicon.ico"}
                alt={token.symbol}
                height={20}
                width={20}
              />
              <p className="ml-2 font-semibold md:text-lg">
                {token.symbol ? token.symbol : token.name}
              </p>
            </div>
            <div>{/*getTokenBalance(token)*/}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletItem;
