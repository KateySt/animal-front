import type { MouseEvent } from "react";
import { Button, type ButtonProps } from "antd";
import { useNavigate } from "react-router";

type ButtonLinkProps = Omit<ButtonProps, "href"> & {
  to: string;
};

const isModifiedClick = (event: MouseEvent) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export const ButtonLink = ({ to, onClick, ...props }: ButtonLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedClick(event)) return;
    event.preventDefault();
    navigate(to);
  };

  return <Button {...props} href={to} onClick={handleClick} />;
};
