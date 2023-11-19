import Link from "next/link";
import NavbarLinks from "./navbarLinks";
import ConnectWalletButton from "../wallet/connectWalletButton";

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
        <ConnectWalletButton />
        <Link href="/" className="btn btn-ghost text-accent bg-neutral flex">
          Launch Game
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
