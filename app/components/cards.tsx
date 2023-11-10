import React from "react";

type cardsPropsType = { title: string; description: string };
const Cards = (props: cardsPropsType) => {
  return (
    <div className="flex flex-col gap-4 px-8 rounded-2xl py-8 bg-neutral w-96">
      <div className="text-2xl font-semibold">{props.title}</div>
      <div className="">{props.description}</div>
    </div>
  );
};

export default Cards;
