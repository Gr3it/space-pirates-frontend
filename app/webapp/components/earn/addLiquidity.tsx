"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useContractRead } from "wagmi";

import { tokensContract } from "@/config/addresses.json";
import { abi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

type TokenWithReserve = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
  reserve: bigint;
};

type TokenInputProps = {
  amount: string;
  handleAmountChange?: (amount: string) => void;
  token: TokenWithReserve;
  refetchTrigger: boolean;
  setRefetchTrigger: (value: boolean) => void;
};

const TokenInput = ({
  amount,
  handleAmountChange,
  token,
  refetchTrigger,
  setRefetchTrigger,
}: TokenInputProps) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0,0");

  const { refetch } = useContractRead({
    address: tokensContract as "0x${string}",
    abi: abi,
    functionName: "balanceOf",
    enabled: !!address,
    args: [address, token.id],
    onSuccess(data: bigint) {
      setBalance(formatUnits(data, token.decimals));
    },
  });

  useEffect(() => {
    if (refetchTrigger) {
      refetch();
      setRefetchTrigger(false);
    }
  }, [refetchTrigger, setRefetchTrigger, refetch]);

  return (
    <div>
      <div>
        <div className="flex gap-2 mb-2 h-12 items-center font-semibold">
          <Image src={token.logoURI} alt="token" height={20} width={20} />
          {token.symbol}
        </div>
      </div>
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
          className={`input input-md w-full rounded-l-md rounded-r-${
            !handleAmountChange ? "md" : "none"
          } ${
            parseFloat(amount) > parseFloat(balance) ? " bg-error-25" : null
          }`}
          value={amount}
          onChange={
            handleAmountChange
              ? (e) => {
                  if (e.target.value) handleAmountChange(e.target.value);
                }
              : () => {}
          }
        />
        {handleAmountChange && (
          <span
            className={`btn btn-md btn-ghost bg-base-100 border-0 rounded-r-md rounded-l-none ${
              parseFloat(amount) > parseFloat(balance) ? " bg-error-25" : null
            }`}
            onClick={() => handleAmountChange(balance)}
          >
            MAX
          </span>
        )}
      </div>
      <label className="label h-4 py-0 mt-2">
        <span className="label-text-alt text-error">
          {parseFloat(amount) > parseFloat(balance)
            ? "Amount exceed balance"
            : ""}
        </span>
      </label>
      {handleAmountChange && (
        <label className="label pt-2">Balance: {balance}</label>
      )}
    </div>
  );
};

export default TokenInput;
