import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa",
};

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
