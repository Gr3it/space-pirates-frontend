import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar container z-50 gap-6 py-4 px-0">
      <div className="flex-1">
        <Link href="/">
          <span className="btn btn-ghost text-xl">Space Pirates</span>
        </Link>
      </div>
      <Link href="/webapp/trade/swap" className="btn btn-accent flex">
        Launch Webapp
      </Link>
      <Link href="/" className="btn btn-ghost text-accent bg-neutral flex">
        Launch Game
      </Link>
    </div>
  );
};

export default Navbar;
