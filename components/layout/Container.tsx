import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container)] px-5 md:px-6${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
