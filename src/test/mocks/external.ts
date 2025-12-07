import { vi } from "vitest";

// Mock React Router
export const mockNavigate = vi.fn();
export const mockUseParams = vi.fn(() => ({ diagramId: "test-diagram-id" }));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: mockUseParams,
}));

// Mock ReactFlow components
vi.mock("@xyflow/react", () => ({
  ReactFlow: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "react-flow");
    return div;
  }),
  Background: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "background");
    return div;
  }),
  Controls: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "controls");
    return div;
  }),
}));

// Mock Theme Context
export const mockUseTheme = vi.fn(() => ({
  theme: "light",
  setTheme: vi.fn(),
}));

vi.mock("@/context/ThemeContext", () => ({
  useTheme: mockUseTheme,
}));

// Mock Auth Context
export const mockUseAuth = vi.fn(() => ({
  user: {
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    metadata: {
      creationTime: "2023-01-01T00:00:00Z",
      lastSignInTime: "2023-12-07T00:00:00Z",
    },
  },
  role: "user",
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  loading: false,
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: mockUseAuth,
}));

export default {};
