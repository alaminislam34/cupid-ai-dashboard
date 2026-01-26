import { AuthProvider } from "@/provider/authProvider";
import DashboardContainer from "./components/DashboardContainer";

export default function DashboardLayout({ children }) {
  // Group layout — root layout handles <html> and <body>.
  return (
    <AuthProvider>
      <DashboardContainer>{children}</DashboardContainer>
    </AuthProvider>
  );
}
