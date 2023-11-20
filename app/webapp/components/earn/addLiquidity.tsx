import { useState } from "react";
import Image from "next/image";

import ChevronDown from "../icons/chevronDown";
import { useContractRead } from "wagmi";

import { tokensContract } from "@/config/addresses.json";
import { abi } from "@/config/abi/SpacePiratesTokens.sol/SpacePiratesTokens.json";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

type Token = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  address?: string;
};

type TokenInputProps = {
  amount: string;
  handleAmountChange?: (amount: string) => void;
  token: Token;
};

const TokenInput = ({ amount, handleAmountChange, token }: TokenInputProps) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0,0");

  const { data, isError, isLoading } = useContractRead({
    address: tokensContract as "0x${string}",
    abi: abi,
    functionName: "balanceOf",
    args: [address, token.id],
    onSuccess(data: bigint) {
      setBalance(formatUnits(data, token.decimals));
    },
  });

  return (
    <div>
      <div>
        <div className="flex gap-2 mb-2 h-12 items-center font-semibold">
          <Image src={token.logoURI} alt="token" height={20} width={20} />
          {token.symbol}
        </div>
      </div>
      <div className="flex input-group-md drop-shadow-md">
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
            className="btn btn-md btn-ghost bg-base-100 border-0 rounded-r-md rounded-l-none"
            onClick={() => handleAmountChange(balance)}
          >
            MAX
          </span>
        )}
      </div>
      {handleAmountChange && (
        <label className="label">Balance: {balance}</label>
      )}
    </div>
  );
};

export default TokenInput;
