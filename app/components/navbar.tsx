import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center p-8 mx-auto justify-between xl:px-0">
        <div className="flex flex-wrap items-center justify-between w-auto">
          <Link href="/">
            <span className="flex items-center space-x-2 text-2xl font-medium">
              <span>Space Pirates</span>
            </span>
          </Link>
        </div>

        <div className="mr-3 space-x-4 flex align-middle justify-center">
          <Link
            href="/"
            className="px-6 py-2 text-base-black bg-accent hover:bg-accent-hover rounded-md md:ml-5"
          >
            Launch Webapp
          </Link>
          <Link
            href="/"
            className="relative px-6 py-2 text-accent focus:outline outline-2 bg-neutral hover:text-accent-hover rounded-md md:ml-5 outline-accent"
          >
            Launch Game
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
