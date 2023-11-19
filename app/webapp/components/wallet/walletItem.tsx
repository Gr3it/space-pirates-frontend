"use client";

import { useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { readContract } from "@wagmi/core";
import { tokensContract } from "@/config/addresses.json";
import { abi as spacePiratesAbi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";

import { formatUnits } from "viem";

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

type WalletItemProps = {
  title: string;
  list: TokensList;
  erc20?: boolean;
};

const WalletItem = ({ title, list, erc20 = false }: WalletItemProps) => {
  const { address, isConnected } = useAccount();

  const [balances, setBalances] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      try {
        const balanceData: { [key: string]: string } = {};

        if (erc20) {
          await Promise.all(
            list.ids.map(async (id) => {
              const token = list.tokens[id];
              const response = await fetchBalance({
                address: address,
                token: token.address as `0x${string}`,
              });

              balanceData[token.name] = response.formatted;
            })
          );
        } else {
          const tokensList = list as TokensList; // Type assertion
          const addressesArray = Array(tokensList.ids.length).fill(address);

          const data: bigint[] = (await readContract({
            address: tokensContract as `0x${string}`,
            abi: spacePiratesAbi,
            functionName: "balanceOfBatch",
            args: [addressesArray, tokensList.ids],
          })) as bigint[];
          tokensList.ids.map((id, index) => {
            const token = tokensList.tokens[id];
            balanceData[token.name] = formatUnits(data[index], token.decimals);
          });
        }
        setBalances(balanceData);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };
    fetchData();
  }, [list, isConnected, address, erc20]);

  return (
    <div className="lg:w-3/6 md:w-4/6 w-full collapse collapse-arrow border border-base-300 bg-base-100 rounded-box drop-shadow">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content ">
        {list.ids.map((id, index) => (
          <div
            key={index}
            className="py-2 gap-y-4 md:gap-y-0 rounded-md drop-shadow-md flex flex-row justify-between items-center"
          >
            <div className="flex items-center">
              <Image
                src={list.tokens[id].logoURI}
                alt={list.tokens[id].symbol}
                height={20}
                width={20}
              />
              <p className="ml-2 font-semibold md:text-lg">
                {list.tokens[id].symbol
                  ? list.tokens[id].symbol
                  : list.tokens[id].name}
              </p>
            </div>
            <div>{balances[list.tokens[id].name] || "0"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletItem;
