import Image from "next/image";
import type { Metadata } from "next";

import projectTokensList from "@/config/constants/projectTokensList.json";
import wrappedTokensList from "@/config/constants/wrappedTokensList.json";
import dexPairsList from "@/config/constants/dexPairsList.json";
import itemsList from "@/config/constants/itemsList.json";
import WalletItem from "../components/wallet/walletItem";

export const metadata: Metadata = {
  title: "Space Pirates Wallet",
};

export default function Home() {
  return (
    <div className="min-h-full p-5 w-full">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">Space Pirates Wallet</h1>
        <p className="text-xl italic">
          Check your Space Pirates tokens balances
        </p>
      </div>
      <div className="flex flex-col gap-y-7 items-center justify-around">
        <WalletItem title="Space Tokens" list={projectTokensList} />
        <WalletItem title="Wrapped Tokens" list={wrappedTokensList} />
        <WalletItem title="LP tokens" list={dexPairsList} erc20 />
        <WalletItem title="Items" list={itemsList} />
      </div>
    </div>
  );
}
