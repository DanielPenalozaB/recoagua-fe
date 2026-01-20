import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
