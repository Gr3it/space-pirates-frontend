import Link from "next/link";

type WIPPageProps = {
  title?: string;
  text?: string;
};

const WIPPage = ({ title, text }: WIPPageProps) => {
  return (
    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div className="sm:text-center lg:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
          {title ? (
            title
          ) : (
            <>
              <span className="block xl:inline">Page</span>{" "}
              <span className="block text-warning xl:inline">not ready ⚠️</span>
            </>
          )}
        </h1>
        <p className="mt-3 text-gray-500 sm:mt-5 sm:text-lg sm:max-w-3xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          {text ? (
            text
          ) : (
            <>
              The page is not ready but we&apos;re actively working on it. Check
              out already developed pages:{" "}
              <Link href="/webapp/trade/swap" className="text-primary">
                swap
              </Link>
              ,{" "}
              <Link href="/webapp/trade/convert" className="text-primary">
                convert
              </Link>
              ,{" "}
              <Link href="/webapp/earn/pools" className="text-primary">
                pools
              </Link>
              ,{" "}
              <Link href="/webapp/faucet/token" className="text-primary">
                project token faucet
              </Link>
              ,{" "}
              <Link href="/webapp/faucet/coin" className="text-primary">
                chain faucet
              </Link>
              ,{" "}
              <Link href="/webapp/wallet" className="text-primary">
                wallet
              </Link>
            </>
          )}
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md drop-shadow-md">
            <button className="btn btn-primary md:btn-lg btn-md px-8 py-3">
              <a
                href="https://emanuele-zini.gitbook.io/space-pirates/"
                target="_blank"
                rel="noopener"
              >
                Read documentation
              </a>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WIPPage;
