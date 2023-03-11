import React, { FC } from "react";

type CardProps = {
  children: React.ReactNode;
  className: string;
};
export const Card: FC<CardProps> = (props) => {
  const { children, className } = props;
  return <div className={`${className}`}>{children}</div>;
};

export default Card;
