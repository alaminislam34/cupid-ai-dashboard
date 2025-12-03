import { ToastContainer } from "react-toastify";
import "../globals.css";
import Providers from "@/provider/query_provider";

export const metadata = {
  title: "Cupid AI Dashboard",
  description: "Dashboard for Cupid AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          {children}
          <ToastContainer
            position="bottom-center"
            autoClose={1500}
            closeButton={false}
          />
        </Providers>
      </body>
    </html>
  );
}
