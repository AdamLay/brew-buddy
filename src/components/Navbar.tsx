import { Link, useLocation } from "@tanstack/react-router";
import { Beaker, BookOpen, Calendar, Home, Menu, Sprout, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/ingredients", label: "Ingredients", icon: Sprout },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/batches", label: "Batches", icon: Beaker },
  { to: "/calendar", label: "Calendar", icon: Calendar },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-base-300 text-base-content shadow-lg border-b-2 border-primary/30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="brand-link text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
          >
            <Beaker className="w-6 h-6 text-primary shrink-0" />
            Brew Buddy
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/" ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`btn btn-ghost btn-sm flex-1 justify-start ${
                    isActive ? "btn-active text-primary" : "hover:bg-base-100"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden btn btn-ghost btn-square p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="menu menu-sm p-2 gap-1 bg-base-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === "/" ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`${isActive ? "btn-active text-primary font-semibold" : "hover:bg-base-100"}`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-2" />}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
