import React from "react";

type ChevronDownProps = {
  height?: string;
  width?: string;
};

const ChevronDown = ({ height = "18", width = "18" }: ChevronDownProps) => {
  return (
    <svg
      className="fill-current"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
    </svg>
  );
};

export default ChevronDown;
