import {
  NavbarContent,
  NavbarItem,
  Navbar as _NavBar,
  Link,
} from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export default function NavBar() {
  return (
    <_NavBar>
      <NavbarContent className="gap-4" justify="center">
        <NavbarItem>
          <Link href="/Home">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/RandomWinnerGame">Random winner Game</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
      <NavbarItem>
        <ConnectButton></ConnectButton>
      </NavbarItem>
      </NavbarContent>
    </_NavBar>
  );
}
