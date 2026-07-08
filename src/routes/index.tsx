import { createFileRoute, Link } from "@tanstack/react-router";
import { Beaker, BookOpen, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    icon: BookOpen,
    title: "Plan Recipes",
    desc: "Define your ingredients and instructions for every cider, mead, or brew you'll ever make.",
    href: "/recipes",
  },
  {
    icon: Beaker,
    title: "Track Batches",
    desc: "Record gravity readings, status, and tasting notes from planning to the final pour.",
    href: "/batches",
  },
  {
    icon: Sprout,
    title: "Manage Ingredients",
    desc: "Keep a master list of your fruits, sugars, yeasts, and spices. Always know what's in stock.",
    href: "/ingredients",
  },
];

function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Beaker className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-base-content leading-tight">Brew Buddy</h1>
        <h2 className="text-2xl text-base-content/60 max-w-2xl mx-auto">
          Plan recipes. Track batches. Perfect your brew.
        </h2>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              to={f.href}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-base-300 hover:border-primary/40"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="card-title text-lg text-base-content">{f.title}</h3>
                </div>
                <p className="text-base-content/70 leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
