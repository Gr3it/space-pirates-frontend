import Link from "next/link";

const NavbarLinks = () => {
  return (
    <>
      <li tabIndex={0}>
        <details>
          <summary>Trade</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/webapp/trade/swap">Swap</Link>
            </li>
            <li>
              <Link href="/webapp/trade/convert">Convert</Link>
            </li>
            <li>
              <Link href="/webapp/trade/split">Split</Link>
            </li>
          </ul>
        </details>
      </li>
      <li tabIndex={1}>
        <details>
          <summary className="justify-between">Earn</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/pools">Pools</Link>
            </li>
            <li>
              <Link href="/staking">Staking</Link>
            </li>
          </ul>
        </details>
      </li>
      <li tabIndex={2}>
        <details>
          <summary className="justify-between">NFTs</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/mint">Mint</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link href="/quest">Quest</Link>
      </li>
      <li tabIndex={4}>
        <details>
          <summary className="justify-between">Faucet</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/faucet">Space faucet</Link>
            </li>
            <li>
              <Link href="/faucet/trx">Sepolia faucet</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link href="/wallet">Wallet</Link>
      </li>
    </>
  );
};

export default NavbarLinks;
