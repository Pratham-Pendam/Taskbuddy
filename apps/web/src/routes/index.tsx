import { createFileRoute, Link } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <div className="flex flex-col justify-center items-center p-4 gap-5">
      <h1 className="font-bold">
        Tired of juggling to-do lists, sticky notes, and reminders?
      </h1>
      <h1 className="font-bold">
        TaskBuddy is your personal productivity sidekick — built to make task
        management simple, smart, and even enjoyable.
      </h1>
      <h1 className="font-bold">
        Whether you're planning your week, managing a project, or just trying to
        remember to water your plants — TaskBuddy has your back.
      </h1>

      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
