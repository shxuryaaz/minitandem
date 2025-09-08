import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CopilotButton } from "@/components/copilot/CopilotButton";

export function DashboardLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 overflow-auto"
        >
          <div className="container mx-auto p-6 max-w-7xl">
            <Outlet />
          </div>
        </motion.main>
      </div>

      <CopilotButton />
    </div>
  );
}