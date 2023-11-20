import Image from "next/image";

import dexPairsList from "@/config/constants/dexPairsList.json";
import PoolsItems from "../../components/earn/poolItems";

type Token = {
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address: string;
};

type TokensList = {
  name: string;
  timestamp: string;
  ids: number[] | string[];
  tokens: Record<string, Token>;
};

const dexPairsListTyped = dexPairsList as TokensList;

export default function Home() {
  return (
    <div className="min-h-full py-5 w-full container">
      <div className="text-center mb-8">
        <p className="text-5xl font-bold mb-2">Space Pirates Pools</p>
        <p className="text-xl italic">Provide liquidity to the dex</p>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {dexPairsList.ids.map((id) => (
          <PoolsItems key={id} pair={dexPairsListTyped.tokens[id]} />
        ))}
      </div>
    </div>
  );
}
