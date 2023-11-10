import Image from "next/image";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import SectionTitle from "./components/sectionTitile";
import Cards from "./components/cards";

const cardContent = [
  {
    title: "Doubloons",
    description:
      "Doubloons (DBL) are the base currency and utility token of the ecosystem.",
  },
  {
    title: "Asteroids",
    description:
      "Asteroids (ASTR) are the rare token of the ecosystem.\n\nASTRs can be used to progress in the game and can be split into veASTR (voting) and stkASTR (staking).",
  },
  {
    title: "Items",
    description:
      "The items category will include the in-game materials and consumables. Such NFTs are obtainable through in-game activities and quests.",
  },
  {
    title: "Titles",
    description:
      "Titles are decorations displayed above the player's head in the metaverse. They can only be obtained by completing challenging tasks.\n\nPlayers will compete with each other to complete title tasks and show the others their accomplishments.",
  },
  {
    title: "Decorations",
    description:
      "Decorations (e.g., furniture, plants, and more) can be placed in metaverse or spaceship units. They can be used to decorate your home in your preferred style.\n\nDecorations can be part of a limited collection or special rewards from events.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Image
        className="absolute mt-[-5rem] mr-[-16rem]"
        src={"/banner.png"}
        width={2560}
        height={1440}
        alt={"banner"}
      ></Image>
      <div className="h-[calc(100vh-104px)]" />
      <SectionTitle pretitle="Tokenomics" title="Ecosystem Tokens">
        All the ecosystem tokens, items, titles, decorations, and gadgets are
        stored in an adapted version of the Ethereum ERC1155 standard. For the
        exchange, we modified the UniswapV2 contracts to support ERC1155 tokens.
        <br />
        <br />
        The token contract provides dynamic management of all stored tokens. The
        token implementation can be easily attached and removed from the storage
        contract like if they were modules.
      </SectionTitle>
      {cardContent.map((item) => (
        <Cards
          title={item.title}
          description={item.description}
          key={item.title}
        />
      ))}
      <Footer />
    </>
  );
}
