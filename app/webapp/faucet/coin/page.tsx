"use client";

import Image from "next/image";

import unWrappedERC20TokensList from "@/config/constants/unWrappedERC20TokensList.json";
import Erc20FaucetCard from "../../components/faucet/erc20FaucetCard";

import { abi } from "@/config/abi/utils/TestnetERC20.sol/Token.json";

import { useContractReads } from "wagmi";
import { Abi } from "abitype";
import { useMounted } from "../../hooks/mounted";

type Token = {
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
};

type TokensList = {
  name: string;
  timestamp: string;
  ids: number[] | string[];
  tokens: Record<string, Token>;
};

const unWrappedERC20TokensListTyped = unWrappedERC20TokensList as TokensList;

export default function Home() {
  const isMounted = useMounted();
  const { data, isSuccess } = useContractReads({
    contracts: unWrappedERC20TokensListTyped.ids
      .filter((id) => {
        if (unWrappedERC20TokensListTyped.tokens[id].address != undefined) {
          return true; // skip
        }
        return false;
      })
      .map((id) => {
        const token = unWrappedERC20TokensListTyped.tokens[id];
        return {
          address: token.address as `0x${string}`,
          abi: abi as Abi,
          functionName: "MAX_MINT",
        };
      }),
  });

  return (
    <div className="min-h-full p-5">
      <div className="text-center mb-8">
        <p className="text-5xl font-bold mb-2">Space Pirates Faucet</p>
        <p className="text-xl italic">
          Start here! Get your tokens and start playing in testnet!
        </p>
      </div>
      <div className="flex justify-center flex-wrap">
        {isSuccess &&
          isMounted &&
          unWrappedERC20TokensList.ids.map((id, index) => {
            return (
              <Erc20FaucetCard
                token={{
                  id: id,
                  maxAmount: data?.[index].result as bigint,
                }}
                key={id}
              />
            );
          })}
      </div>
      <p className="text-2xl font-semibold mt-10 flex flex-col">
        <span className="text-center">
          To mint Sepolia ETH go on the official faucets:
        </span>
        <br />
        <a
          href="https://sepoliafaucet.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xl"
        >
          Sepolia faucet (alchemy)
        </a>
        <a
          href="https://sepolia-faucet.pk910.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xl"
        >
          Sepolia PoW faucet
        </a>
        <a
          href="https://www.infura.io/faucet/sepolia"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xl"
        >
          Sepolia faucet (infura)
        </a>
      </p>
    </div>
  );
}
