import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock IntersectionObserver
vi.stubGlobal(
  "IntersectionObserver",
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
);

// Mock ResizeObserver
vi.stubGlobal(
  "ResizeObserver",
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
);

// Mock HTMLElement.getBoundingClientRect
Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
  configurable: true,
  enumerable: true,
  value: () => ({
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    bottom: 120,
    right: 120,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock AuthContext
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(() => ({
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
  })),
}));

// Mock ThemeContext
vi.mock("@/context/ThemeContext", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
    setTheme: vi.fn(),
  })),
}));

// Mock React Router
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ diagramId: "test-diagram-id" })),
}));

// Mock ReactFlow
vi.mock("@xyflow/react", () => ({
  ReactFlow: vi.fn((props) => {
    return React.createElement("div", {
      "data-testid": "react-flow",
      ...props,
    });
  }),
  Background: vi.fn(() =>
    React.createElement("div", { "data-testid": "background" })
  ),
  Controls: vi.fn(() =>
    React.createElement("div", { "data-testid": "controls" })
  ),
}));
