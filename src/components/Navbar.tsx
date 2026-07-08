import { Beaker, BookOpen, Calendar, Home, Sprout } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <a
      href={href}
      className={`btn btn-ghost btn-sm ${isActive ? "btn-active text-primary" : "hover:bg-base-100"}`}
    >
      {icon}
      {label}
    </a>
  );
}

export function Navbar({ pathname = "/" }: { pathname?: string }) {
  const activeClass = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-base-300 text-base-content shadow-lg border-b-2 border-primary/30 print:hidden">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <a
            href="/"
            className="brand-link text-xl hover:text-primary transition-colors flex items-center gap-2"
          >
            <Beaker className="w-6 h-6 text-primary" />
            Brew Buddy
          </a>
        </div>
        <div className="navbar-end">
          <ul className="flex gap-1 list-none">
            <li>
              <NavItem
                href="/"
                label="Home"
                icon={<Home className="w-4 h-4 mr-1" />}
                isActive={activeClass("/")}
              />
            </li>
            <li>
              <NavItem
                href="/recipes"
                label="Recipes"
                icon={<BookOpen className="w-4 h-4 mr-1" />}
                isActive={activeClass("/recipes")}
              />
            </li>
            <li>
              <NavItem
                href="/ingredients"
                label="Ingredients"
                icon={<Sprout className="w-4 h-4 mr-1" />}
                isActive={activeClass("/ingredients")}
              />
            </li>
            <li>
              <NavItem
                href="/batches"
                label="Batches"
                icon={<Beaker className="w-4 h-4 mr-1" />}
                isActive={activeClass("/batches")}
              />
            </li>
            <li>
              <NavItem
                href="/calendar"
                label="Calendar"
                icon={<Calendar className="w-4 h-4 mr-1" />}
                isActive={activeClass("/calendar")}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
