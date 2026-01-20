import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de usuarios",
};

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
