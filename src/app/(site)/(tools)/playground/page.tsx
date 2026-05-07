import type { Metadata } from "next";
import { PlaygroundClient } from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "Playground — Paradise",
};

export default function Playground() {
  return <PlaygroundClient />;
}
