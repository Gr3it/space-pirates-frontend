"use client";

import { sepolia } from "wagmi";

import { useConnect, useAccount } from "wagmi";
import { useMounted } from "../../hooks/mounted";

import { useSwitchNetwork } from "wagmi";
import { useNetwork } from "wagmi";
import { useEffect } from "react";

const ConnectWalletButton = () => {
  const isMounted = useMounted();

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { switchNetworkAsync } = useSwitchNetwork();

  const { chain, chains } = useNetwork();

  useEffect(() => {
    const modalElement = document.getElementById("unsupported_chain");
    if (modalElement instanceof HTMLDialogElement) {
      modalElement.close();
    }

    if (isConnected && !chains.some((obj) => obj.id === chain?.id)) {
      if (modalElement instanceof HTMLDialogElement) {
        modalElement.showModal();
        document.getElementById("close_button")?.blur();
      }
    }
  }, [isConnected, chain, chains]);

  return (
    <>
      <button
        onClick={() =>
          isConnected ? () => {} : connect({ connector: connectors[0] })
        }
        className={`btn btn-accent flex ${
          isConnected && isMounted ? "cursor-auto" : ""
        }`}
      >
        {isConnected && isMounted
          ? address?.substring(0, 6) + "..." + address?.substring(38)
          : "Connect Wallet"}
      </button>

      <dialog id="unsupported_chain" className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Unsupported chain</h3>
            <form method="dialog">
              <button
                id="close_button"
                className="btn btn-square btn-error btn-outline"
                tabIndex={1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
          <p className="py-4">
            Switch to one of the following chain to be able to use the app
            correctly:
          </p>
          <div className="flex gap-4 flex-col">
            {isMounted &&
              chains.map((item) => (
                <button
                  className="btn btn-secondary w-full"
                  key={item.id}
                  onClick={() => {
                    if (switchNetworkAsync) {
                      switchNetworkAsync(item.id);
                    }
                  }}
                >
                  Switch chain to {item.name}
                </button>
              ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConnectWalletButton;
