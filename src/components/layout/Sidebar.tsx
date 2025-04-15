
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <h1 className="text-xl font-bold text-sidebar-foreground">
              SecureStock
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                to="/dashboard"
                className={cn("sidebar-menu-item", {
                  active: isActive("/dashboard"),
                })}
              >
                <LayoutDashboard size={20} />
                {!collapsed && <span>Tableau de bord</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/employees"
                className={cn("sidebar-menu-item", {
                  active: isActive("/employees"),
                })}
              >
                <Users size={20} />
                {!collapsed && <span>Employés</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/stock"
                className={cn("sidebar-menu-item", {
                  active: isActive("/stock"),
                })}
              >
                <Package size={20} />
                {!collapsed && <span>Stock</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={cn("sidebar-menu-item", {
                  active: isActive("/settings"),
                })}
              >
                <Settings size={20} />
                {!collapsed && <span>Paramètres</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="sidebar-menu-item w-full justify-center md:justify-start"
          >
            <LogOut size={20} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
