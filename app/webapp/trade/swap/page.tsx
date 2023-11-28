"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import CardContainer from "../../components/trade/cardContainer";
import TokenInput from "../../components/trade/tokenInput";
import DoubleArrows from "../../components/icons/doubleArrows";

import dexPairsList from "@/config/constants/dexPairsList.json";
import projectTokensList from "@/config/constants/projectTokensList.json";
import wrappedTokensList from "@/config/constants/wrappedTokensList.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { routerContract, tokensContract } from "@/config/addresses.json";
import { abi as tokensContractAbi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";
import { Abi, formatUnits, maxInt256, parseUnits } from "viem";
import { toast } from "react-toastify";
import { abi as routerAbi } from "@/config/abi/dex/SpacePiratesRouter.sol/SpacePiratesRouter.json";
import { useDebounce } from "use-debounce";
import { abi as pairAbi } from "@/config/abi/dex/SpacePiratesPair.sol/SpacePiratesPair.json";

type DexToken = {
  name: string;
  symbol: string;
  address: "0x${string}";
  tokenA: number;
  tokenB: number;
  poolId: number;
  decimals: number;
  logoURI: string;
};

type DexTokensList = {
  name: string;
  timestamp: string;
  ids: string[];
  swapMapping: Record<string, number[]>;
  tokens: Record<string, DexToken>;
};

type Token = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

type TokensList = {
  name: string;
  timestamp: string;
  ids: number[];
  tokens: Record<string, Token>;
};

const dexPairsListTyped = dexPairsList as DexTokensList;
const projectTokensListTyped = projectTokensList as TokensList;
const wrappedTokensListTyped = wrappedTokensList as TokensList;

const tokenList = {
  ...projectTokensListTyped.tokens,
  ...wrappedTokensListTyped.tokens,
} as Record<string, Token>;

export default function Home() {
  const [tokenA, setTokenA] = useState(projectTokensListTyped.tokens[1]);
  const [tokenB, setTokenB] = useState(projectTokensListTyped.tokens[2]);
  const [amountB, setAmountB] = useState("0");
  const [amountA, setAmountA] = useState("0");
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [expectOut, setExpectOut] = useState(false);
  const [reserveA, setReserveA] = useState(BigInt(0));
  const [reserveB, setReserveB] = useState(BigInt(0));

  const [debouncedAmountA] = useDebounce(amountA, 500);
  const [debouncedAmountB] = useDebounce(amountB, 500);

  const [needApprove, setNeedApprove] = useState(false);

  const { address } = useAccount();

  const { refetch } = useContractRead({
    address: tokensContract as "0x${string}",
    abi: tokensContractAbi,
    functionName: "balanceOfBatch",
    enabled: !!address,
    args: [
      [address, address],
      [tokenA.id, tokenB.id],
    ],
    onSuccess(data: bigint[]) {
      setBalanceA(formatUnits(data[0], tokenA.decimals));
      setBalanceB(formatUnits(data[1], tokenB.decimals));
    },
  });

  const getPairAddress = () => {
    return tokenA.id > tokenB.id
      ? dexPairsListTyped.tokens[`${tokenB.id}-${tokenA.id}`].address
      : dexPairsListTyped.tokens[`${tokenA.id}-${tokenB.id}`].address;
  };

  const { refetch: refetchReserves } = useContractRead({
    address: getPairAddress() as "0x${string}",
    abi: pairAbi,
    functionName: "getReserves",
    onSuccess(data: bigint[]) {
      if (tokenA.id > tokenB.id) {
        setReserveB(data[0]);
        setReserveA(data[1]);
      } else {
        setReserveA(data[0]);
        setReserveB(data[1]);
      }
    },
  });

  useContractRead({
    address: tokensContract as `0x${string}`,
    abi: tokensContractAbi as Abi,
    functionName: "isApprovedForAll",
    enabled: !!address,
    args: [address, routerContract],
    onSuccess(data) {
      setNeedApprove(!data);
    },
  });

  const { config: approveConfig } = usePrepareContractWrite({
    address: tokensContract as `0x${string}`,
    abi: tokensContractAbi,
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

  /* swap in */

  const { config: swapExactInConfig } = usePrepareContractWrite({
    address: routerContract as `0x${string}`,
    abi: routerAbi,
    functionName: "swapExactTokensForTokens",
    enabled: !needApprove && parseFloat(debouncedAmountA) != 0 && !expectOut,
    args: [
      parseUnits(debouncedAmountA, tokenA.decimals),
      0,
      [tokenA.id, tokenB.id],
      address,
      Math.round(new Date().getTime() / 1000 + 3600),
    ],
  });
  const { data: swapExactInData, write: swapExactInWrite } = useContractWrite({
    ...swapExactInConfig,
    onError(error) {
      toast.error(String(error));
    },
  });
  const { isLoading: isSwapExactInLoading } = useWaitForTransaction({
    hash: swapExactInData?.hash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      toast.success("Successfully minted the tokens!");
      refetch();
    },
  });

  /* swap out */

  const { config: swapExactOutConfig } = usePrepareContractWrite({
    address: routerContract as `0x${string}`,
    abi: routerAbi,
    functionName: "swapTokensForExactTokens",
    enabled: !needApprove && parseFloat(debouncedAmountA) != 0 && expectOut,
    args: [
      parseUnits(debouncedAmountB, tokenB.decimals),
      maxInt256,
      [tokenA.id, tokenB.id],
      address,
      Math.round(new Date().getTime() / 1000 + 3600),
    ],
  });
  const { data: swapExactOutData, write: swapExactOutWrite } = useContractWrite(
    {
      ...swapExactOutConfig,
      onError(error) {
        toast.error(String(error));
      },
    }
  );
  const { isLoading: isSwapExactOutLoading } = useWaitForTransaction({
    hash: swapExactOutData?.hash,
    onError(error) {
      toast.error(String(error));
    },
    onSuccess(data) {
      toast.success("Successfully minted the tokens!");
      refetch();
    },
  });

  const getExpectedAmountB = (amount: string) => {
    return (
      reserveB -
      (reserveA * reserveB) / (reserveA + parseUnits(amount, tokenA.decimals))
    );
  };

  const getExpectedAmountA = (amount: string) => {
    return (
      (reserveB * reserveA) / (reserveB - parseUnits(amount, tokenB.decimals)) -
      reserveA
    );
  };

  const handleAmountAChange = (amount: string) => {
    setAmountA(amount);
    setAmountB(formatUnits(getExpectedAmountB(amount), tokenB.decimals));
    setExpectOut(false);
  };

  const handleAmountBChange = (amount: string) => {
    if (parseUnits(amount, tokenB.decimals) >= reserveB) {
      toast.error("the amount exceed the reserves");
      return;
    }
    setAmountB(amount);
    setAmountA(formatUnits(getExpectedAmountA(amount), tokenA.decimals));
    setExpectOut(true);
  };

  const openModal = (id: string) => {
    const modalElement = document.getElementById(id);
    if (modalElement instanceof HTMLDialogElement) {
      modalElement.close();
    }

    if (modalElement instanceof HTMLDialogElement) {
      modalElement.showModal();
      document.getElementById("close_button")?.blur();
    }
  };

  const invertTokens = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
    setBalanceA(balanceB);
    setBalanceB(balanceA);
    setExpectOut(!expectOut);
  };

  useEffect(() => {
    refetchReserves();
  }, [tokenA, tokenB, refetchReserves]);

  return (
    <div className="flex justify-center items-center py-20">
      <CardContainer
        title="Swap"
        subtitle="Swap instantly Space Pirates tokens"
      >
        <>
          <TokenInput
            handleShowModal={() => openModal("chose_tokenA")}
            amount={amountA}
            handleAmountChange={handleAmountAChange}
            token={tokenA}
            balance={balanceA}
            highlight={!expectOut}
          />
          <div className="flex justify-center">
            <button
              className="btn btn-circle btn-outline border-0 my-4"
              onClick={() => invertTokens()}
            >
              <DoubleArrows />
            </button>
          </div>
          <TokenInput
            handleShowModal={() => openModal("chose_tokenB")}
            amount={amountB}
            handleAmountChange={handleAmountBChange}
            token={tokenB}
            balance={balanceB}
            highlight={expectOut}
            hideMax={true}
          />
          <div className="mt-8 text-center">
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
                onClick={() =>
                  expectOut ? swapExactOutWrite?.() : swapExactInWrite?.()
                }
                disabled={
                  (!swapExactInWrite || isSwapExactInLoading) &&
                  (!swapExactOutWrite || isSwapExactOutLoading)
                }
                className="btn btn-primary w-full"
              >
                {isSwapExactInLoading || isSwapExactOutLoading
                  ? "Swapping tokens..."
                  : "Swap"}
              </button>
            )}
          </div>
        </>
      </CardContainer>
      <dialog id="chose_tokenA" className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Chose first token</h3>
          <form method="dialog">
            {Object.keys(dexPairsListTyped.swapMapping).map((id, index) => {
              const token = tokenList[id];

              return (
                <button
                  key={index}
                  className="w-full flex justify-between items-center px-4 py-4 first:pt-2 last:pb-2 hover:bg-base-200 hover:rounded-md"
                  onClick={() => {
                    setTokenA(token);
                    setAmountA("0");
                    refetch();
                    if (
                      !dexPairsListTyped.swapMapping[id].includes(tokenB.id)
                    ) {
                      openModal("chose_tokenB");
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      className="rounded-full"
                      src={token.logoURI}
                      alt={token.name}
                      height={25}
                      width={25}
                      layout="fixed"
                    />
                    <div className="ml-3 font-semibold text-left">
                      {token.name}
                      <p className="text-left text-base-content text-sm text-opacity-60 font-normal">
                        {token.symbol}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog id="chose_tokenB" className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Chose second token</h3>
          <form method="dialog">
            {dexPairsListTyped.swapMapping[tokenA.id].map((id, index) => {
              const token = tokenList[id];

              return (
                <button
                  key={index}
                  className="w-full flex justify-between items-center px-4 py-4 first:pt-2 last:pb-2 hover:bg-base-200 hover:rounded-md"
                  onClick={() => {
                    setTokenB(token), setAmountB("0");
                    refetch();
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      className="rounded-full"
                      src={token.logoURI}
                      alt={token.name}
                      height={25}
                      width={25}
                      layout="fixed"
                    />
                    <div className="ml-3 font-semibold text-left">
                      {token.name}
                      <p className="text-left text-base-content text-sm text-opacity-60 font-normal">
                        {token.symbol}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
