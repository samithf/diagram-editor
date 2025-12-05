import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { DashboardHome } from "./pages/DashboardHome";
import { DashboardLayout } from "./components/DashboardLayout";
import type { JSX } from "react";
import { DiagramEditor } from "./pages/DiagramEditor";
import Profile from "./pages/Profile";

import "@xyflow/react/dist/style.css";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
        </Route>

        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DiagramEditor />} />
          <Route path=":diagramId" element={<DiagramEditor />} />
        </Route>

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
