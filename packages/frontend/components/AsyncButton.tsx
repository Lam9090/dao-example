import { Button, ButtonProps } from "@nextui-org/react";
import React, { useState } from "react";

export default function AsyncButton({ onClick, ...props }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClick = async (e: any) => {
    try {
      setIsLoading(true);
      await onClick?.(e);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const overrideIsLoading = "isLoading" in props;
  return (
    <Button
      onClick={handleOnClick}
      {...props}
      isLoading={overrideIsLoading ? props.isLoading : isLoading}
    ></Button>
  );
}
