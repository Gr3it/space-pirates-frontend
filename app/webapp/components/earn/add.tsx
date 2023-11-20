"use client";
import { useState } from "react";
import TokenInput from "./addLiquidity";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useContractRead } from "wagmi";

import { routerContract, tokensContract } from "@/config/addresses.json";
import { abi as routerAbi } from "@/config/abi/dex/SpacePiratesRouter.sol/SpacePiratesRouter.json";
import { abi as tokenAbi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";
import { Abi, parseUnits } from "viem";
import { toast } from "react-toastify";

type TokenWithReserve = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
  reserve: bigint;
};

type AddProps = {
  tokenA: TokenWithReserve;
  tokenB: TokenWithReserve;
};

export default function Add({ tokenA, tokenB }: AddProps) {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const [needApprove, setNeedApprove] = useState(false);

  const { address } = useAccount();

  useContractRead({
    address: tokensContract as `0x${string}`,
    abi: tokenAbi as Abi,
    functionName: "isApprovedForAll",
    args: [address, routerContract],
    onSuccess(data) {
      setNeedApprove(!data);
    },
  });

  const { config: approveConfig } = usePrepareContractWrite({
    address: tokensContract as `0x${string}`,
    abi: tokenAbi,
    functionName: "setApprovalForAll",
    args: [routerContract, true],
  });
  const { data: approveData, write: approveWrite } = useContractWrite({
    ...approveConfig,
    onError(error) {
      toast.error(String(error));
    },
  });
  const { isLoading: isApprovedLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      toast.success("Successfully minted the tokens!");
      setNeedApprove(false);
    },
  });

  const { config: addConfig } = usePrepareContractWrite({
    address: routerContract as `0x${string}`,
    abi: routerAbi,
    functionName: "addLiquidity",
    args: [
      tokenA.id,
      tokenB.id,
      parseUnits(amountA, tokenA.decimals),
      parseUnits(amountB, tokenB.decimals),
      0,
      0,
      address,
      new Date().getTime() / 1000 + 3600,
    ],
  });
  const { data: addData, write: addWrite } = useContractWrite({
    ...addConfig,
    onError(error) {
      toast.error(String(error));
    },
  });
  const { isLoading: isAddLoading } = useWaitForTransaction({
    hash: addData?.hash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      toast.success("Successfully minted the tokens!");
      setNeedApprove(false);
    },
  });

  const handleAmountAChange = (amount: string) => {
    setAmountA(amount);
  };

  const handleAmountBChange = (amount: string) => {
    setAmountB(amount);
  };
  return (
    <>
      <div className="flex gap-4">
        <TokenInput
          amount={amountA}
          token={tokenA}
          handleAmountChange={handleAmountAChange}
        />
        <TokenInput
          amount={amountB}
          token={tokenB}
          handleAmountChange={handleAmountBChange}
        />
      </div>
      <div className="flex">
        <div className="w-full">
          {needApprove ? (
            <button
              onClick={() => approveWrite?.()}
              disabled={!approveWrite || isApprovedLoading}
              className="btn btn-primary w-full"
            >
              {isApprovedLoading ? "Approving..." : "Approve"}
            </button>
          ) : (
            <button
              onClick={() => addWrite?.()}
              disabled={!addWrite || isAddLoading}
              className="btn btn-primary w-full"
            >
              {isAddLoading ? "Adding liquidity..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
