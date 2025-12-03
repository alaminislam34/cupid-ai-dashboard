import { ToastContainer } from "react-toastify";
import "../../globals.css";
import Sidebar from "./components/SideBar/Sidebar";
import Providers from "@/provider/query_provider";
import { AuthProvider } from "@/provider/authProvider";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          {/* <AuthProvider> */}
            <section className="flex flex-row m-4 gap-6">
              <div>
                <Sidebar />
              </div>
              <div className="w-full px-4">{children}</div>
            </section>
            <ToastContainer
              position="bottom-center"
              autoClose={1500}
              closeButton={false}
            />{" "}
          {/* </AuthProvider> */}
        </Providers>
      </body>
    </html>
  );
}
