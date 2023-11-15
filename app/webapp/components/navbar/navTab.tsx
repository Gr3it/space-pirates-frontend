import Link from "next/link";
import { useRouter } from "next/router";

type NavTabProps = {
  page: "trade" | "earn";
};

const NavTab = ({ page }: NavTabProps) => {
  const router = useRouter();

  const tradeTabs = [
    { name: "Swap", link: "/webapp/trade/swap" },
    { name: "Convert", link: "/webapp/trade/convert" },
    { name: "Split", link: "/webapp/trade/split" },
  ];
  const earnTabs = [
    { name: "Pools", link: "/webapp/earn/pools" },
    { name: "Staking", link: "/webapp/earn/staking" },
  ];

  const tabs = page === "trade" ? tradeTabs : earnTabs;

  return (
    <div className="tabs h-15 justify-center bg-base-100 rounded-t-md p-4">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`tab tab-bordered font-semibold md:mx-4 mx-1 ${
            router.pathname === tab.link ? "tab-active" : ""
          }`}
        >
          <Link href={tab.link}>{tab.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default NavTab;
