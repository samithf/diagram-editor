import { Home, User2, BarChart4 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: <Home size={20} />, label: "Dashboard", route: "/dashboard" },
    {
      icon: <BarChart4 size={20} />,
      label: "Editor",
      route: "/editor",
    },
    {
      icon: <User2 size={20} />,
      label: "Profile",
      route: "/profile",
    },
  ];

  const isActive = (route: string) => {
    return location.pathname.includes(route);
  };

  return (
    <aside className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col h-full w-56 border-r border-gray-200 dark:border-gray-700">
      <h3 className="p-4 border-b border-gray-200 dark:border-gray-700 text-center font-semibold">
        Diagram Editor
      </h3>
      {/* Nav items */}
      <nav className="flex-1 mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center cursor-pointer 
              transition-colors mx-3 py-2 rounded-full
              ${
                isActive(item.route)
                  ? "bg-blue-600 dark:bg-blue-700 text-white shadow-md"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            onClick={() => {
              navigate(item.route);
            }}
          >
            <div className="flex items-center justify-center w-10">
              {item.icon}
            </div>
            <span className="text-sm whitespace-nowrap overflow-hidden">
              {item.label}
            </span>
          </div>
        ))}
      </nav>
      <div className="p-4 text-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}
