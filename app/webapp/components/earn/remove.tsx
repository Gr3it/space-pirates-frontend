"use client";

import Image from "next/image";

import { useContractReads, useWaitForTransaction } from "wagmi";
import { useAccount } from "wagmi";
import { Abi, formatUnits, parseUnits } from "viem";
import { useState } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { routerContract } from "@/config/addresses.json";
import { abi as routerAbi } from "@/config/abi/dex/SpacePiratesRouter.sol/SpacePiratesRouter.json";
import { abi as pairAbi } from "@/config/abi/dex/SpacePiratesPair.sol/SpacePiratesPair.json";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

import { writeContract } from "@wagmi/core";

type TokenWithReserve = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
  reserve: bigint;
};

type RemoveProps = {
  pair: {
    address: `0x${string}`;
    abi: Abi;
  };
  tokenA: TokenWithReserve;
  tokenB: TokenWithReserve;
  refetch: () => Promise<any>;
};

export default function Remove({ pair, tokenA, tokenB, refetch }: RemoveProps) {
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("0");
  const [expectedA, setExpectedA] = useState("0");
  const [expectedB, setExpectedB] = useState("0");
  const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
  const [lpDecimals, setLpDecimals] = useState<number>(18);
  const [removeLiquidityHash, setRemoveLiquidityHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);

  const [debouncedAmount] = useDebounce(amount, 500);

  const { address } = useAccount();

  const getExpectedTokenA = (amount: string): string => {
    return formatUnits(
      (tokenA.reserve * parseUnits(amount, lpDecimals)) / totalSupply,
      lpDecimals
    );
  };

  const getExpectedTokenB = (amount: string): string => {
    return formatUnits(
      (tokenB.reserve * parseUnits(amount, lpDecimals)) / totalSupply,
      lpDecimals
    );
  };

  const formatDecimals = (value: string): string => {
    const [integerPart, decimalPart] = value.split(".");

    const truncatedDecimalPart = decimalPart ? decimalPart.substring(0, 4) : "";

    const formattedIntegerPart = integerPart !== "0" ? integerPart : "0";

    return truncatedDecimalPart
      ? `${formattedIntegerPart}.${truncatedDecimalPart}`
      : formattedIntegerPart;
  };

  useContractReads({
    contracts: [
      { ...pair, functionName: "decimals" },
      { ...pair, functionName: "totalSupply" },
    ],
    onSuccess(data) {
      const decimals = data[0].result as number;
      const totalSupply = data[1].result as bigint;
      setTotalSupply(totalSupply);
      setLpDecimals(decimals);
    },
  });

  const { refetch: balanceRefetch } = useContractReads({
    contracts: [
      { ...pair, functionName: "balanceOf", args: [address as `0x${string}`] },
      { ...pair, functionName: "decimals" },
    ],
    enabled: !!address,
    onSuccess(data) {
      const balance = data[0].result as bigint;
      const decimals = data[1].result as number;
      setBalance(formatUnits(balance, decimals));
    },
  });

  const { config } = usePrepareContractWrite({
    address: pair.address as `0x${string}`,
    abi: pairAbi,
    functionName: "approve",
    args: [routerContract, parseUnits(debouncedAmount, lpDecimals)],
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
    async onSuccess(data) {
      toast.success("Successfully approved the token!");
      setIsRemovingLiquidity(true);

      const { hash } = await writeContract({
        address: routerContract as `0x${string}`,
        abi: routerAbi,
        functionName: "removeLiquidity",
        args: [
          tokenA.id,
          tokenB.id,
          parseUnits(debouncedAmount, lpDecimals),
          0,
          0,
          address,
          Math.round(new Date().getTime() / 1000 + 3600),
        ],
      });
      setRemoveLiquidityHash(hash);
    },
  });

  useWaitForTransaction({
    hash: removeLiquidityHash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      setIsRemovingLiquidity(false);
      toast.success("Successfully removed liquidity!");
      refetch();
      balanceRefetch();
    },
  });

  return (
    <>
      <p className="text-base">LP Balance: {balance}</p>
      <div className="flex gap-4">
        <div className="w-full">
          <div className="flex drop-shadow-md">
            <input
              type="number"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minLength={1}
              maxLength={79}
              min={0}
              spellCheck="false"
              className={`input input-md w-full rounded-l-md rounded-r-none ${
                parseFloat(amount) > parseFloat(balance) ? " bg-error-25" : null
              }`}
              value={amount}
              onChange={(e) => {
                if (e.target.value) {
                  setAmount(e.target.value);
                  setExpectedA(getExpectedTokenA(e.target.value));
                  setExpectedB(getExpectedTokenB(e.target.value));
                }
              }}
            />
            <span
              className={`btn btn-md btn-ghost bg-base-100 border-0 rounded-r-md rounded-l-none ${
                parseFloat(amount) > parseFloat(balance) ? " bg-error-25" : null
              }`}
              onClick={() => {
                setAmount(balance);
                setExpectedA(getExpectedTokenA(balance));
                setExpectedB(getExpectedTokenB(balance));
              }}
            >
              MAX
            </span>
          </div>
          <label className="label h-4 py-0 mt-2">
            <span className="label-text-alt text-error">
              {parseFloat(amount) > parseFloat(balance)
                ? "Amount exceed balance"
                : ""}
            </span>
          </label>
        </div>
        <div className="w-full">
          <div className="flex gap-2 mb-2 h-12 items-center font-semibold">
            <Image src={tokenA.logoURI} alt="token" height={20} width={20} />
            {tokenA.symbol}
            <div className="ml-auto">{formatDecimals(expectedA)}</div>
          </div>
          <div className="flex gap-2 mb-2 h-12 items-center font-semibold">
            <Image src={tokenB.logoURI} alt="token" height={20} width={20} />
            {tokenB.symbol}
            <div className="ml-auto">{formatDecimals(expectedB)}</div>
          </div>
        </div>
      </div>
      <button
        onClick={() => write?.()}
        disabled={
          !write ||
          isLoading ||
          isRemovingLiquidity ||
          parseFloat(amount) > parseFloat(balance)
        }
        className="btn btn-primary w-full"
      >
        {isLoading
          ? "Approving token..."
          : isRemovingLiquidity
          ? "Removing liquidity..."
          : "Remove Liquidity"}
      </button>
    </>
  );
}
