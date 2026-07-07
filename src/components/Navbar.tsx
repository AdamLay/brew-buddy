import { Link, useLocation } from "@tanstack/react-router";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-base-800 text-base-content shadow-md">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
            Brew Buddy
          </Link>
        </div>
        <div className="navbar-end">
          <ul className="flex gap-2 list-none">
            <li>
              <Link
                to="/recipes"
                className={`btn btn-ghost ${pathname.startsWith("/recipes") ? "btn-active" : ""}`}
              >
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/batches"
                className={`btn btn-ghost ${pathname.startsWith("/batches") ? "btn-active" : ""}`}
              >
                Batches
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
