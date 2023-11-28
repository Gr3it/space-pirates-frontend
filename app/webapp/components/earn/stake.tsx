"use client";

import { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { masterChefContract } from "@/config/addresses.json";
import { abi as masterchefAbi } from "@/config/abi/dex/SpacePiratesMasterChef.sol/SpacePiratesMasterChef.json";
import { abi as pairAbi } from "@/config/abi/dex/SpacePiratesPair.sol/SpacePiratesPair.json";

import { Abi, formatUnits, parseUnits } from "viem";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
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

type pair = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  poolId: number | null;
  logoURI: string;
};

type stakeProps = {
  tokenA: TokenWithReserve;
  tokenB: TokenWithReserve;
  pair: pair;
  refetch: () => Promise<any>;
};

export default function Stake({ tokenA, tokenB, pair, refetch }: stakeProps) {
  const [lpBalance, setLpBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");

  const [amount, setAmount] = useState("0");

  const [stackingHash, setStackingHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [isStacking, setIsStacking] = useState(false);

  const [debouncedAmount] = useDebounce(amount, 500);

  const { address } = useAccount();

  const masterchefConfig = {
    address: masterChefContract as `0x${string}`,
    abi: masterchefAbi as Abi,
  };

  const { refetch: stakeBalanceRefetch } = useContractRead({
    ...masterchefConfig,
    functionName: "userInfo",
    args: [pair.poolId as number, address as `0x${string}`],

    enabled: !!address && pair.poolId != null,
    onSuccess(data: bigint[]) {
      const balance = data[0] as bigint;
      setStakedBalance(formatUnits(balance, pair.decimals));
    },
  });

  const { refetch: lpBalanceRefetch } = useContractRead({
    address: pair.address as `0x${string}`,
    abi: pairAbi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],

    enabled: !!address,
    onSuccess(data: bigint) {
      setLpBalance(formatUnits(data, pair.decimals));
    },
  });

  const { config } = usePrepareContractWrite({
    address: pair.address as `0x${string}`,
    abi: pairAbi,
    functionName: "approve",
    args: [masterChefContract, parseUnits(debouncedAmount, pair.decimals)],
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
      setIsStacking(true);

      const { hash } = await writeContract({
        address: masterChefContract as `0x${string}`,
        abi: masterchefAbi,
        functionName: "deposit",
        args: [pair.poolId, parseUnits(debouncedAmount, pair.decimals)],
      });
      setStackingHash(hash);
    },
  });

  useWaitForTransaction({
    hash: stackingHash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      setIsStacking(false);
      toast.success("Successfully removed liquidity!");
      refetch();
      setAmount("0");
      lpBalanceRefetch();
      stakeBalanceRefetch();
    },
  });

  return (
    <>
      {pair.poolId != null ? (
        <>
          <p className="text-base">Staked Balance: {stakedBalance}</p>
          <div>
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
                  parseFloat(amount) > parseFloat(lpBalance)
                    ? " bg-error-25"
                    : null
                }`}
                value={amount}
                onChange={(e) => {
                  if (e.target.value) {
                    setAmount(e.target.value);
                  }
                }}
              />
              <span
                className={`btn btn-md btn-ghost bg-base-100 border-0 rounded-r-md rounded-l-none ${
                  parseFloat(amount) > parseFloat(lpBalance)
                    ? " bg-error-25"
                    : null
                }`}
                onClick={() => {
                  setAmount(lpBalance);
                }}
              >
                MAX
              </span>
            </div>

            <label className="label h-4 py-0 mt-2">
              <span className="label-text-alt text-error">
                {parseFloat(amount) > parseFloat(lpBalance)
                  ? "Amount exceed balance"
                  : ""}
              </span>
            </label>
            <p className="text-base">LP Balance: {lpBalance}</p>
          </div>
          <button
            onClick={() => write?.()}
            disabled={
              !write ||
              isLoading ||
              isStacking ||
              parseFloat(amount) > parseFloat(lpBalance)
            }
            className="btn btn-primary w-full"
          >
            {isLoading
              ? "Approving token..."
              : isStacking
              ? "Stacking..."
              : "Stake"}
          </button>
        </>
      ) : (
        <p className="text-2xl text-center text-error">
          The pool don&apos;t have a liquidity mining pool active
        </p>
      )}
    </>
  );
}
