import React from "react";

type ArrowsDownProps = {
  height?: string;
  width?: string;
};

const ArrowsDown = ({ height = "24", width = "24" }: ArrowsDownProps) => {
  return (
    <svg
      className="fill-current"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 490 490"
    >
      <path d="M52.8,311.3c-12.8-12.8-12.8-33.4,0-46.2c6.4-6.4,14.7-9.6,23.1-9.6s16.7,3.2,23.1,9.6l113.4,113.4V32.7   c0-18,14.6-32.7,32.7-32.7c18,0,32.7,14.6,32.7,32.7v345.8L391,265.1c12.8-12.8,33.4-12.8,46.2,0c12.8,12.8,12.8,33.4,0,46.2   L268.1,480.4c-6.1,6.1-14.4,9.6-23.1,9.6c-8.7,0-17-3.4-23.1-9.6L52.8,311.3z" />
    </svg>
  );
};

export default ArrowsDown;
