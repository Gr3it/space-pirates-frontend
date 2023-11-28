import Image from "next/image";

import ChevronDown from "../icons/chevronDown";

type unWrappedToken = {
  name: string;
  symbol: string;
  address: "0x${string}" | null;
  decimals: number;
  logoURI: string;
};

type wrappedToken = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  unWrapped: unWrappedToken;
};

type projectToken = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

type TokenInputProps = {
  handleShowModal?: () => void;
  amount: string;
  handleAmountChange?: (amount: string) => void;
  token: wrappedToken | unWrappedToken | projectToken;
  loading?: boolean;
  balance?: string;
  highlight?: boolean;
  hideMax?: boolean;
};

const TokenInput = ({
  handleShowModal,
  amount,
  handleAmountChange,
  token,
  loading,
  balance = "0",
  highlight = false,
  hideMax = false,
}: TokenInputProps) => {
  return (
    <div>
      <div>
        <button
          className="btn modal-button btn-ghost gap-2 mb-2"
          onClick={handleShowModal ? () => handleShowModal() : () => {}}
        >
          <Image src={token.logoURI} alt="token" height={20} width={20} />
          {token.symbol}
          {handleShowModal && <ChevronDown />}
        </button>
      </div>
      <div className="flex input-group-md drop-shadow-md">
        <input
          readOnly={handleAmountChange == undefined}
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
            !handleAmountChange || hideMax ? "md" : "none border-r-0"
          } ${
            handleAmountChange &&
            parseFloat(amount) > parseFloat(balance) &&
            !hideMax
              ? " bg-error-25"
              : null
          } ${highlight ? "input-accent" : null}`}
          value={amount}
          onChange={
            handleAmountChange
              ? (e) => {
                  if (e.target.value) handleAmountChange(e.target.value);
                }
              : () => {}
          }
        />
        {loading && (
          <div className="btn loading bg-base-100 border-0 rounded-none text-base-300 p-0"></div>
        )}
        {handleAmountChange && !hideMax && (
          <span
            className={`btn btn-md btn-ghost bg-base-100 rounded-r-md rounded-l-none ${
              parseFloat(amount) > parseFloat(balance) && !hideMax
                ? " bg-error-25"
                : null
            } ${highlight ? "!border-1 !border-accent !border-l-0" : null}`}
            onClick={() => handleAmountChange(balance)}
          >
            MAX
          </span>
        )}
      </div>
      <label className="label h-4 py-0 mt-2">
        <span className="label-text-alt text-error">
          {handleAmountChange &&
          parseFloat(amount) > parseFloat(balance) &&
          !hideMax
            ? "Amount exceed balance"
            : ""}
        </span>
      </label>
      {handleAmountChange && (
        <label className="label">Balance: {balance}</label>
      )}
    </div>
  );
};

export default TokenInput;
