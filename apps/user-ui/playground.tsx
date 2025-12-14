"use client";
import React, { ReactNode, useState } from "react";

const Playground = () => {
  const [isActive] = useState(false);
  return (
    <>
      <Child className={isActive ? "bg-red-500" : ""}>playground</Child>
      <p></p>
    </>
  );
};

function Child({ children }: { children: ReactNode; className?: string }) {
  return <div className="bg-green-500">{children}</div>;
}

export default Playground;
