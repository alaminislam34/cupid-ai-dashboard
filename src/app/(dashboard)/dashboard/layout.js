import "../../globals.css";
import Sidebar from "./components/SideBar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <section className="flex flex-row">
          <div className="m-4">
            <Sidebar />
          </div>
          <div>{children}</div>
        </section>
      </body>
    </html>
  );
}
