import Link from "next/link";
import NavbarLinks from "./navbarLinks";

const Navbar = () => {
  return (
    <div className="navbar container z-50 py-4 px-0">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
          >
            <NavbarLinks />
          </ul>
        </div>
        <Link href="/">
          <span className="btn btn-ghost text-xl">Space Pirates</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <NavbarLinks />
        </ul>
      </div>

      <div className="navbar-end gap-6 ">
        <Link href="/webapp/trade/swap" className="btn btn-accent flex">
          Connect Wallet
        </Link>
        <Link href="/" className="btn btn-ghost text-accent bg-neutral flex">
          Launch Game
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

{
  /*

<div className="w-full">
      <nav className="container relative flex flex-wrap  p-8 mx-auto justify-between xl:px-0">
        <div className="flex flex-wrap items-center justify-between w-auto">
          <Link href="/">
            <span className="flex items-center space-x-2 text-2xl font-medium">
              <span>Space Pirates</span>
            </span>
          </Link>
        </div>
        <NavbarLinks />
        <div className="mr-3 space-x-4 flex align-middle justify-center">
          <div className="px-6 py-2 text-base-black bg-accent hover:bg-accent-hover rounded-md md:ml-5 cursor-pointer select-none">
            Connect Wallet
          </div>
          <Link
            href="/"
            className="relative px-6 py-2 text-accent focus:outline outline-2 bg-neutral hover:text-accent-hover rounded-md md:ml-5 outline-accent"
          >
            Launch Game
          </Link>
        </div>
      </nav>
    </div>


*/
}
