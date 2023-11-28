import InfoCircle from "../icons/infoCircle";

type InfoBannerProps = {
  children: React.ReactNode;
};

const InfoBanner = ({ children }: InfoBannerProps) => {
  return (
    <div className="alert flex mb-5 max-w-lg">
      <InfoCircle />
      <div>{children}</div>
    </div>
  );
};

export default InfoBanner;
