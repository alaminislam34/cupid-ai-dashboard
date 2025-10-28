import "../globals.css";

export const metadata = {
  title: "Cupid AI Dashboard",
  description: "Dashboard for Cupid AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
