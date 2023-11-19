"use client";

import { useState } from "react";
import FaucetCard from "../../components/faucet/faucetCard";

import { faucetContract as faucetContractAddress } from "@/config/addresses.json";
import { abi as spacePiratesFaucetAbi } from "@/config/abi/SpacePiratesFaucet.sol/SpacePiratesFaucet.json";

import { useContractRead } from "wagmi";
import { readContracts } from "@wagmi/core";
import { Abi } from "abitype";

const faucetContract = {
  address: faucetContractAddress as `0x${string}`,
  abi: spacePiratesFaucetAbi,
};

type tokens = { id: bigint; maxAmount: bigint }[];

export default function Home() {
  const [supportedTokens, setSupportedTokens] = useState<tokens>([]);

  const { data } = useContractRead({
    ...faucetContract,
    functionName: "getSupportedTokens",
    async onSuccess(data: bigint[]) {
      let tokens: { id: bigint; maxAmount: bigint }[] = [];
      try {
        const responses = await readContracts({
          contracts: data.map((id: bigint) => ({
            address: faucetContractAddress as `0x${string}`,
            abi: spacePiratesFaucetAbi as Abi,
            functionName: "tokenMintLimit",
            args: [id],
          })),
        });

        const maxAmounts: bigint[] = responses.map((response) => {
          if (response.status === "success" && response.result) {
            return response.result as bigint;
          } else {
            throw new Error("Error fetching max amount");
          }
        });

        data.map((id, index) => {
          tokens.push({ id, maxAmount: maxAmounts[index] });
        });

        setSupportedTokens(tokens);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  });

  return (
    <div className="min-h-full p-5 w-full">
      <div className="text-center mb-8">
        <p className="text-5xl font-bold mb-2">Space Pirates Faucet</p>
        <p className="text-xl italic">
          Start here! Get your tokens and start playing in testnet!
        </p>
      </div>
      <div className="flex justify-center">
        <div className="grid md:grid-cols-3 gap-4">
          {supportedTokens.map((token) => (
            <FaucetCard key={token.id} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}
