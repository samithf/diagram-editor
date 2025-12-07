import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the hooks with factory functions
vi.mock("@/hooks/useDiagramState", () => ({
  useDiagramState: vi.fn(() => ({
    nodes: [],
    edges: [],
    contextMenu: null,
    setNodes: vi.fn(),
    setEdges: vi.fn(),
    setContextMenu: vi.fn(),
    onNodesChange: vi.fn(),
    onEdgesChange: vi.fn(),
    onConnect: vi.fn(),
    onEdgeContextMenu: vi.fn(),
    onNodeContextMenu: vi.fn(),
    changeEdgeType: vi.fn(),
    onPaneClick: vi.fn(),
    handleEdgeDelete: vi.fn(),
    handleNodeDelete: vi.fn(),
  })),
}));

vi.mock("@/hooks/useDiagramEditor", () => ({
  useDiagramEditor: vi.fn(() => ({
    addNode: vi.fn(),
    saveDiagram: vi.fn(),
    clearCanvas: vi.fn(),
    loadDiagram: vi.fn(),
    isLoading: false,
    currentDiagramId: null,
    currentDiagramName: "Test Diagram",
    hasEditAccess: vi.fn().mockResolvedValue(true),
  })),
}));

// Mock components
vi.mock("@/components/editor/DiagramToolbar", () => ({
  DiagramToolbar: () => <div data-testid="diagram-toolbar">Toolbar</div>,
}));

vi.mock("@/components/editor/ContextMenu", () => ({
  ContextMenu: () => <div data-testid="context-menu">Context Menu</div>,
}));

vi.mock("@/components/editor/EditableNode", () => ({
  EditableNode: () => <div data-testid="editable-node">Node</div>,
}));

import { DiagramEditor } from "./DiagramEditor";
import { useDiagramState } from "@/hooks/useDiagramState";
import { useDiagramEditor } from "@/hooks/useDiagramEditor";

// Get references to the mocked functions
const mockUseDiagramState = useDiagramState as ReturnType<typeof vi.fn>;
const mockUseDiagramEditor = useDiagramEditor as ReturnType<typeof vi.fn>;

describe("DiagramEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render without errors", () => {
      expect(() => render(<DiagramEditor />)).not.toThrow();
    });

    it("should render main components", () => {
      render(<DiagramEditor />);

      expect(screen.getByTestId("diagram-toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow")).toBeInTheDocument();
      expect(screen.getByTestId("background")).toBeInTheDocument();
      expect(screen.getByTestId("controls")).toBeInTheDocument();
    });

    it("should call required hooks", () => {
      render(<DiagramEditor />);

      expect(mockUseDiagramState).toHaveBeenCalled();
      expect(mockUseDiagramEditor).toHaveBeenCalled();
    });

    it("should show loading state when isLoading is true", () => {
      mockUseDiagramEditor.mockReturnValue({
        addNode: vi.fn(),
        saveDiagram: vi.fn(),
        clearCanvas: vi.fn(),
        loadDiagram: vi.fn(),
        isLoading: true,
        currentDiagramId: null,
        currentDiagramName: "Test Diagram",
        hasEditAccess: vi.fn().mockResolvedValue(true),
      });

      render(<DiagramEditor />);

      expect(screen.getByText("Loading diagram...")).toBeInTheDocument();
    });
  });
});
