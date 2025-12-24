import { ToastContainer } from "react-toastify";
import "../globals.css";
import Providers from "@/provider/query_provider";
import { AuthProvider } from "@/provider/authProvider";
import DashboardContainer from "./components/DashboardContainer";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <AuthProvider>
            <DashboardContainer>{children}</DashboardContainer>

            <ToastContainer
              position="bottom-center"
              autoClose={1500}
              closeButton={false}
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
