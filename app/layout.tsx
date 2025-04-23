import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo of env var bug",
  description: "Demo of env var bug",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
