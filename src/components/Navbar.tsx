import { Link, useLocation } from "@tanstack/react-router";
import { Beaker, BookOpen, Calendar, Home, Sprout } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-base-300 text-base-content shadow-lg border-b-2 border-primary/30 print:hidden">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link
            to="/"
            className="brand-link text-xl hover:text-primary transition-colors flex items-center gap-2"
          >
            <Beaker className="w-6 h-6 text-primary" />
            Brew Buddy
          </Link>
        </div>
        <div className="navbar-end">
          <ul className="flex gap-1 list-none">
            <li>
              <Link
                to="/"
                className={`btn btn-ghost btn-sm ${pathname === "/" ? "btn-active text-primary" : "hover:bg-base-100"}`}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/recipes"
                className={`btn btn-ghost btn-sm ${pathname.startsWith("/recipes") ? "btn-active text-primary" : "hover:bg-base-100"}`}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/ingredients"
                className={`btn btn-ghost btn-sm ${pathname.startsWith("/ingredients") ? "btn-active text-primary" : "hover:bg-base-100"}`}
              >
                <Sprout className="w-4 h-4 mr-1" />
                Ingredients
              </Link>
            </li>
            <li>
              <Link
                to="/batches"
                className={`btn btn-ghost btn-sm ${pathname.startsWith("/batches") ? "btn-active text-primary" : "hover:bg-base-100"}`}
              >
                <Beaker className="w-4 h-4 mr-1" />
                Batches
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`btn btn-ghost btn-sm ${pathname.startsWith("/calendar") ? "btn-active text-primary" : "hover:bg-base-100"}`}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Calendar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
