"use client";

import Image from "next/image";
import { useState } from "react";

import { useContractReads } from "wagmi";

import { abi } from "@/config/abi/dex/SpacePiratesPair.sol/SpacePiratesPair.json";
import { Abi } from "abitype";

import wrappedTokensList from "@/config/constants/wrappedTokensList.json";
import projectTokensList from "@/config/constants/projectTokensList.json";
import itemsList from "@/config/constants/itemsList.json";

import { formatUnits, parseUnits } from "viem";
import Add from "./add";
import Remove from "./remove";
import Stake from "./stake";
import Unstake from "./unstake";

type Token = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
};

type TokenWithReserve = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
  reserve: bigint;
};

type TokensList = {
  name: string;
  timestamp: string;
  ids: number[] | string[];
  tokens: Record<string, Token>;
};

type PoolsItemProps = {
  pair: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    poolId: number | null;
    logoURI: string;
  };
};

const wrappedTokensListTyped = wrappedTokensList as TokensList;
const projectTokensListTyped = projectTokensList as TokensList;
const itemsListTyped = itemsList as TokensList;

export default function PoolsItem({ pair }: PoolsItemProps) {
  const [tokenA, setTokenA] = useState<TokenWithReserve | undefined>(undefined);
  const [tokenB, setTokenB] = useState<TokenWithReserve | undefined>(undefined);

  const [page, setPage] = useState<"add" | "remove" | "stake" | "unstake">(
    "add"
  );

  const getToken = (id: bigint): Token => {
    const idNumber = Number(id);
    if (id < 0)
      return {
        id: 0,
        name: "undefined",
        symbol: "undefined",
        decimals: 18,
        logoURI: "/favicon.ico",
      };
    if (id < 100) return projectTokensListTyped.tokens[idNumber];
    if (id < 1000) return wrappedTokensListTyped.tokens[idNumber];
    if (id < 10000) return itemsListTyped.tokens[idNumber];
    return {
      id: 0,
      name: "undefined",
      symbol: "undefined",
      decimals: 18,
      logoURI: "/favicon.ico",
    };
  };
  const pairContract = {
    address: pair.address as `0x${string}`,
    abi: abi as Abi,
  };

  const { refetch } = useContractReads({
    contracts: [
      {
        ...pairContract,
        functionName: "getTokenIds",
      },
      {
        ...pairContract,
        functionName: "getReserves",
      },
    ],
    onSuccess(data) {
      const ids = data[0].result as bigint[];
      const reserves = data[1].result as bigint[];
      setTokenA({ ...getToken(ids[0]), reserve: reserves[0] });
      setTokenB({ ...getToken(ids[1]), reserve: reserves[1] });
    },
  });

  return (
    <div className="xl:col-span-4 md:col-span-6 col-span-12 card card-compact drop-shadow-lg bg-base-200 collapse collapse-arrow">
      {tokenA && tokenB ? (
        <div className="card-body gap-y-5">
          <div className="relative">
            <div className="absolute">
              <Image
                src={tokenA.logoURI}
                alt={tokenA.name}
                height={25}
                width={25}
              />
            </div>
            <div className="absolute inset-3">
              <Image
                src={tokenB.logoURI}
                alt={tokenB.name}
                height={25}
                width={25}
              />
            </div>
            <p className="ml-14 font-bold text-xl">{pair.name}</p>
          </div>
          <div className="flex">
            <p className="text-base">
              Liquidity {tokenA.symbol}:{" "}
              {formatUnits(tokenA.reserve, tokenA.decimals)}
            </p>
            <p className="text-base">
              Liquidity {tokenB.symbol}:{" "}
              {formatUnits(tokenB.reserve, tokenB.decimals)}
            </p>
          </div>
          <div className="text-xl font-semibold">Manage position</div>
          <div role="tablist" className="tabs tabs-boxed bg-base-100">
            <button
              onClick={() => setPage("add")}
              className={`tab ${page == "add" ? "tab-active" : null}`}
            >
              Add
            </button>
            <button
              onClick={() => setPage("remove")}
              className={`tab ${page == "remove" ? "tab-active" : null}`}
            >
              Remove
            </button>
            <button
              onClick={() => setPage("stake")}
              className={`tab ${page == "stake" ? "tab-active" : null}`}
            >
              Stake
            </button>
            <button
              onClick={() => setPage("unstake")}
              className={`tab ${page == "unstake" ? "tab-active" : null}`}
            >
              Unstake
            </button>
          </div>
          {(() => {
            if (page === "add")
              return <Add tokenA={tokenA} tokenB={tokenB} refetch={refetch} />;
            if (page === "remove")
              return (
                <Remove
                  pair={pairContract}
                  tokenA={tokenA}
                  tokenB={tokenB}
                  refetch={refetch}
                />
              );
            if (page === "stake")
              return (
                <Stake
                  tokenA={tokenA}
                  tokenB={tokenB}
                  pair={pair}
                  refetch={refetch}
                />
              );
            if (page === "unstake")
              return (
                <Unstake
                  tokenA={tokenA}
                  tokenB={tokenB}
                  pair={pair}
                  refetch={refetch}
                />
              );
            return null;
          })()}
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-5 sm:p-2">
          <div className="flex flex-1 flex-col gap-5">
            <div className="bg-gray-200 w-2/5 animate-pulse h-8 rounded-md"></div>
            <div className="flex gap-x-4">
              <div className="bg-gray-200 w-1/2 animate-pulse h-3 rounded-md"></div>
              <div className="bg-gray-200 w-1/2 animate-pulse h-3 rounded-md"></div>
            </div>
            <div className="flex gap-x-4">
              <div className="bg-gray-200 w-1/2 animate-pulse h-10 rounded-md"></div>
              <div className="bg-gray-200 w-1/2 animate-pulse h-10 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="bg-gray-200 w-1/2 h-6 animate-pulse rounded-md"></div>
            <div className="bg-gray-200 w-1/2 h-6 animate-pulse rounded-md"></div>
          </div>
        </div>
      )}
    </div>
  );
}
