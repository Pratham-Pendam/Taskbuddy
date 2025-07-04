import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";


export default function Header() {
  const links = [
    { to: "/", label: "Home" },
  ];

  return (
    <div className="w-full font-bold text-2xl justify-between flex items-center p-4">
      <Link to="/dashboard">
      <h1>TaskBuddy</h1>
      </Link>
     <ModeToggle/>
    </div>
  );
}
