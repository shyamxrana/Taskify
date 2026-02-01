import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Layout = ({ children, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex opacity-100 translate-x-0" />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <Sidebar
        className={`md:hidden transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[250px] transition-all duration-300 w-full">
        {/* Top Header with Theme Toggle & Hamburger */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 bg-background/80 backdrop-blur-sm z-30">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
