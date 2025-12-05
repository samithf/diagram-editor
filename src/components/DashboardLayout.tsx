import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {/* <h1 className="text-2xl font-semibold mb-6">Welcome, {user.email}</h1> */}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
