import React from "react";

type cardsPropsType = { title: string; description: string };
const Cards = (props: cardsPropsType) => {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
      <div className="">{props.title}</div>
      <div className="">{props.description}</div>
    </div>
  );
};

export default Cards;
