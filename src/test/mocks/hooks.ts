import { vi } from "vitest";

// Mock custom hooks
export const mockUseDiagramState = vi.fn(() => ({
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
}));

export const mockUseDiagramEditor = vi.fn(() => ({
  addNode: vi.fn(),
  saveDiagram: vi.fn(),
  clearCanvas: vi.fn(),
  loadDiagram: vi.fn(),
  isLoading: false,
  currentDiagramId: null,
  currentDiagramName: "Test Diagram",
  hasEditAccess: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/hooks/useDiagramState", () => ({
  useDiagramState: mockUseDiagramState,
}));

vi.mock("@/hooks/useDiagramEditor", () => ({
  useDiagramEditor: mockUseDiagramEditor,
}));

export default {};
