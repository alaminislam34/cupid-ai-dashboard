import "../../globals.css";
import Sidebar from "./components/SideBar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <section className="flex flex-row m-4 gap-6">
          <div >
            <Sidebar />
          </div>
          <div className="w-full px-4">{children}</div>
        </section>
      </body>
    </html>
  );
}
