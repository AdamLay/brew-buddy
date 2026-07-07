import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Welcome to Brew Buddy</h1>
      <p className="mt-4 text-lg text-gray-600">
        Your brewing companion for planning recipes, tracking batches, and perfecting every brew.
      </p>
    </div>
  );
}
