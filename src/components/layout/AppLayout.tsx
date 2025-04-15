
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // On mobile, collapse sidebar by default
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main className={cn("main-content transition-all duration-300", {
        "ml-64": !sidebarCollapsed,
        "ml-16": sidebarCollapsed,
      })}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="page-title">
              Bienvenue, {user?.username || "Utilisateur"}
            </h1>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
