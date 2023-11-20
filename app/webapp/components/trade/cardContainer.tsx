type CardContainerProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const CardContainer = ({ children, title, subtitle }: CardContainerProps) => {
  return (
    <div className="card m-3 py-2 drop-shadow-lg bg-base-200 sm:min-w-[420px]">
      <div className="text-center my-4">
        <p className="text-2xl font-bold mb-2">{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="divider m-0 p-0"></div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default CardContainer;
