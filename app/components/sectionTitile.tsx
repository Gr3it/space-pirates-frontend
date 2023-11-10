import React, { ReactNode } from "react";
import Container from "./container";

type sectionTitlePropsType = {
  align?: string;
  pretitle?: string;
  title?: string;
  children?: ReactNode;
};

const SectionTitle = (props: sectionTitlePropsType) => {
  return (
    <Container
      className={`flex w-full flex-col mt-4 ${
        props.align === "left" ? "" : "items-center justify-center text-center"
      }`}
    >
      {props.pretitle && (
        <div className="text-sm font-bold tracking-wider text-primary uppercase">
          {props.pretitle}
        </div>
      )}

      {props.title && (
        <h2 className="max-w-4xl mt-3 text-3xl font-bold leading-snug tracking-tight lg:leading-tight lg:text-4xl text-base-white">
          {props.title}
        </h2>
      )}

      {props.children && (
        <p className="max-w-4xl py-4 text-lg leading-normal lg:text-xl xl:text-xl text-base-white">
          {props.children}
        </p>
      )}
    </Container>
  );
};

export default SectionTitle;
