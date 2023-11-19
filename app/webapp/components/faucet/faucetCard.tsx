"use client";

import { useState } from "react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";

import projectTokensList from "@/config/constants/projectTokensList.json";
import itemsList from "@/config/constants/itemsList.json";
import { faucetContract } from "@/config/addresses.json";
import { abi } from "@/config/abi/SpacePiratesFaucet.sol/SpacePiratesFaucet.json";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { formatUnits, parseUnits } from "viem";

type token = { id: bigint; maxAmount: bigint };

type FaucetCardProps = {
  token: token;
};

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

const projectTokensListTyped = projectTokensList as TokensList;
const itemsListTyped = itemsList as TokensList;

const FaucetCard = ({ token }: FaucetCardProps) => {
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const getToken = (id: bigint): Token => {
    const idNumber = Number(id);
    if (id < 0)
      return {
        name: "undefined",
        symbol: "undefined",
        decimals: 18,
        logoURI: "/favicon.ico",
      };
    if (id < 100) return projectTokensListTyped.tokens[idNumber];
    if (id < 1000)
      return {
        name: "undefined",
        symbol: "undefined",
        decimals: 18,
        logoURI: "/favicon.ico",
      };
    if (id < 10000) return itemsListTyped.tokens[idNumber];
    return {
      name: "undefined",
      symbol: "undefined",
      decimals: 18,
      logoURI: "/favicon.ico",
    };
  };

  const tokenObject = getToken(token.id);

  const { config } = usePrepareContractWrite({
    address: faucetContract as `0x${string}`,
    abi: abi,
    functionName: "mintToken",
    args: [token.id, parseUnits(debouncedAmount, tokenObject.decimals)],
  });
  const { data, write } = useContractWrite({
    ...config,
    onError(error) {
      toast.error(String(error));
    },
  });
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      toast.success("Successfully minted the tokens!");
    },
  });

  return (
    <div className="card card-normal m-3 p-3 drop-shadow-lg bg-base-200">
      <div className="card-body items-center p-2">
        <div className="card-title justify-center">
          <Image
            src={tokenObject.logoURI}
            className="rounded-xl"
            alt={tokenObject.symbol}
            width={25}
            height={25}
          />
          <p className="text-2xl font-bold">{tokenObject.name}</p>
        </div>
        <div className="form-control mb-8">
          <span className="label label-text">
            Enter {tokenObject.symbol} amount
          </span>
          <label className="input-group drop-shadow-md flex">
            <input
              type="number"
              placeholder="0"
              className="input rounded-r-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span
              className="btn btn-ghost bg-base-100 border-0 rounded-l-none"
              onClick={() =>
                setAmount(formatUnits(token.maxAmount, tokenObject.decimals))
              }
            >
              MAX
            </span>
          </label>
          <span className="label label-text font-bold">
            Max mintable amount{" "}
            {formatUnits(token.maxAmount, tokenObject.decimals)}
          </span>
        </div>
        <button
          onClick={() => write?.()}
          disabled={!write || isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? "Minting..." : "Mint"}
        </button>
      </div>
    </div>
  );
};

export default FaucetCard;
