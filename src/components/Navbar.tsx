import { Link, useLocation } from "@tanstack/react-router";
import { Beaker, BookOpen, Home, Sprout } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-base-800 text-base-content shadow-md">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link to="/" className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2">
            <Beaker className="w-6 h-6 text-primary" />
            Brew Buddy
          </Link>
        </div>
        <div className="navbar-end">
          <ul className="flex gap-2 list-none">
            <li>
              <Link to="/" className={`btn btn-ghost ${pathname === "/" ? "btn-active" : ""}`}>
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/recipes"
                className={`btn btn-ghost ${pathname === "/recipes" ? "btn-active" : ""}`}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/ingredients"
                className={`btn btn-ghost ${pathname === "/ingredients" ? "btn-active" : ""}`}
              >
                <Sprout className="w-4 h-4 mr-1" />
                Ingredients
              </Link>
            </li>
            <li>
              <Link
                to="/batches"
                className={`btn btn-ghost ${pathname.startsWith("/batches") ? "btn-active" : ""}`}
              >
                <Beaker className="w-4 h-4 mr-1" />
                Batches
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
