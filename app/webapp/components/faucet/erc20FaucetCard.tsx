"use client";

import { useState } from "react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import unWrappedERC20TokenList from "@/config/constants/unWrappedERC20TokensList.json";

import { abi } from "@/config/abi/utils/TestnetERC20.sol/Token.json";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { formatUnits, parseUnits } from "viem";

type token = { id: string; maxAmount: bigint };

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

const unWrappedERC20TokensListTyped = unWrappedERC20TokenList as TokensList;

const Erc20FaucetCard = ({ token }: FaucetCardProps) => {
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { address } = useAccount();

  const tokenObject = unWrappedERC20TokensListTyped.tokens[token.id];

  const { config } = usePrepareContractWrite({
    address: tokenObject.address as `0x${string}`,
    abi: abi,
    functionName: "mint",
    args: [address, parseUnits(debouncedAmount, tokenObject.decimals)],
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
        <button
          onClick={async () => {
            try {
              // Explicitly assert that 'ethereum' exists on 'window'
              const ethereum = (window as any).ethereum;

              // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
              const wasAdded = await ethereum.request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC20",
                  options: {
                    address: tokenObject.address, // The address of the token.
                    symbol: tokenObject.symbol, // A ticker symbol or shorthand, up to 5 characters.
                    decimals: tokenObject.decimals, // The number of decimals in the token.
                  },
                },
              });
            } catch (error) {
              console.error(error);
            }
          }}
          className="btn btn-neutral w-full"
        >
          Add token to MetaMask
        </button>
      </div>
    </div>
  );
};

export default Erc20FaucetCard;
