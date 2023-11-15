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
              <Link href="/webapp/earn/pools">Pools</Link>
            </li>
            <li>
              <Link href="/webapp/earn/staking">Staking</Link>
            </li>
          </ul>
        </details>
      </li>
      <li tabIndex={2}>
        <details>
          <summary className="justify-between">NFTs</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/webapp/nft/shop">Shop</Link>
            </li>
            <li>
              <Link href="/webapp/nft/mint">Mint</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link href="/webapp/quest">Quest</Link>
      </li>
      <li tabIndex={4}>
        <details>
          <summary className="justify-between">Faucet</summary>
          <ul className="p-2 bg-base-200 z-50 drop-shadow-md">
            <li>
              <Link href="/webapp/faucet/token">Space faucet</Link>
            </li>
            <li>
              <a href="/webapp/faucet/coin">Sepolia faucet</a>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link href="/webapp/wallet">Wallet</Link>
      </li>
    </>
  );
};

export default NavbarLinks;
