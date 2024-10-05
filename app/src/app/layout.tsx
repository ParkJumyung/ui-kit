import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="flex flex-col w-full min-h-screen">{children}</body>
    </html>
  );
}
