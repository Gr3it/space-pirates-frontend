import React, { ReactNode } from "react";

type containerPropsType = {
  className?: string;
  children?: ReactNode;
};

const Container = (props: containerPropsType) => {
  return (
    <div
      className={`container px-8 mx-auto xl:px-0 ${
        props.className ? props.className : ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default Container;
