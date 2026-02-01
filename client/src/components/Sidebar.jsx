import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { cn } from "../lib/utils";
import { LayoutDashboard, User, BarChart2, LogOut, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    let cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div
      className={cn(
        "w-[250px] bg-card border-r border-border flex flex-col p-6 fixed h-screen top-0 left-0 z-50 transition-transform duration-300",
        className
      )}
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Task Master
        </h2>
      </div>

      <div className="flex flex-col items-center mb-8 text-center">
        <Avatar className="h-20 w-20 ring-4 ring-primary mb-3">
          {user && user.profilePic ? (
            <AvatarImage
              src={getProfileImageUrl(user.profilePic)}
              alt={user.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="font-semibold text-foreground text-lg">
            {user?.name}
          </div>
          <div className="text-sm text-muted-foreground px-2 line-clamp-2">
            {user?.bio || "Ready to conquer tasks!"}
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 flex-1">
        <Link
          to="/"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isActive("/") &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          <LayoutDashboard className="h-5 w-5" /> Dashboard
        </Link>
        <Link
          to="/profile"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isActive("/profile") &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          <User className="h-5 w-5" /> Profile
        </Link>
        <Link
          to="/history"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isActive("/history") &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          <Clock className="h-5 w-5" /> History
        </Link>
        <Link
          to="/stats"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isActive("/stats") &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          <BarChart2 className="h-5 w-5" /> Statistics
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-destructive hover:bg-destructive/10 transition-colors font-medium border border-destructive/20"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
