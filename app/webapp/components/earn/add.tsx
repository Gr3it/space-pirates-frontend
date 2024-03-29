"use client";
import { useState } from "react";
import AddLiquidity from "./addLiquidity";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useContractRead } from "wagmi";
import { useDebounce } from "use-debounce";

import { routerContract, tokensContract } from "@/config/addresses.json";
import { abi as routerAbi } from "@/config/abi/dex/SpacePiratesRouter.sol/SpacePiratesRouter.json";
import { abi as tokenAbi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";
import { Abi, parseUnits, formatUnits } from "viem";
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
  refetch: () => Promise<any>;
};

export default function Add({ tokenA, tokenB, refetch }: AddProps) {
  const [amountA, setAmountA] = useState("0.0");
  const [amountB, setAmountB] = useState("0.0");

  const [debouncedAmountA] = useDebounce(amountA, 500);
  const [debouncedAmountB] = useDebounce(amountB, 500);

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const [needApprove, setNeedApprove] = useState(false);

  const { address } = useAccount();

  const getTokenBAmount = (amount: string) => {
    return formatUnits(
      (parseUnits(amount, tokenA.decimals) * tokenB.reserve) / tokenA.reserve,
      tokenB.decimals
    );
  };

  const getTokenAAmount = (amount: string) => {
    return formatUnits(
      (parseUnits(amount, tokenB.decimals) * tokenA.reserve) / tokenB.reserve,
      tokenA.decimals
    );
  };

  useContractRead({
    address: tokensContract as `0x${string}`,
    abi: tokenAbi as Abi,
    functionName: "isApprovedForAll",
    enabled: !!address,
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
      toast.success("Successfully approved the tokens!");
      setNeedApprove(false);
    },
  });

  const { config: addConfig } = usePrepareContractWrite({
    address: routerContract as `0x${string}`,
    abi: routerAbi,
    functionName: "addLiquidity",
    enabled:
      !needApprove &&
      parseFloat(debouncedAmountA) != 0 &&
      parseFloat(debouncedAmountB) != 0,
    args: [
      tokenA.id,
      tokenB.id,
      parseUnits(debouncedAmountA, tokenA.decimals),
      parseUnits(debouncedAmountB, tokenB.decimals),
      0,
      0,
      address,
      Math.round(new Date().getTime() / 1000 + 3600),
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
      refetch();
      setRefetchTrigger(true);
    },
  });

  const handleAmountAChange = (amount: string) => {
    setAmountA(amount);
    setAmountB(getTokenBAmount(amount));
  };

  const handleAmountBChange = (amount: string) => {
    setAmountB(amount);
    setAmountA(getTokenAAmount(amount));
  };

  return (
    <>
      <div className="flex gap-4">
        <AddLiquidity
          amount={amountA}
          token={tokenA}
          handleAmountChange={handleAmountAChange}
          refetchTrigger={refetchTrigger}
          setRefetchTrigger={setRefetchTrigger}
        />
        <AddLiquidity
          amount={amountB}
          token={tokenB}
          handleAmountChange={handleAmountBChange}
          refetchTrigger={refetchTrigger}
          setRefetchTrigger={setRefetchTrigger}
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
