import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDiagramEditor } from "./useDiagramEditor";
import type { Node, Edge } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";

// Mock dependencies
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-1234"),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/services/DiagramService", () => ({
  DiagramService: {
    getDiagram: vi.fn(),
    upsertDiagram: vi.fn(),
    deleteDiagram: vi.fn(),
    isDiagramOwner: vi.fn(),
  },
}));

vi.mock("@/services/UserAccessService", () => ({
  UserAccessService: {
    hasAccessToDiagram: vi.fn(),
    getDiagramAccessLevel: vi.fn(),
  },
}));

import { toast } from "sonner";
import { DiagramService } from "@/services/DiagramService";
import { UserAccessService } from "@/services/UserAccessService";
import { v4 as uuidv4 } from "uuid";

const mockToast = toast as unknown as {
  success: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
};
const mockDiagramService = DiagramService as unknown as {
  getDiagram: ReturnType<typeof vi.fn>;
  upsertDiagram: ReturnType<typeof vi.fn>;
  deleteDiagram: ReturnType<typeof vi.fn>;
  isDiagramOwner: ReturnType<typeof vi.fn>;
};
const mockUserAccessService = UserAccessService as unknown as {
  hasAccessToDiagram: ReturnType<typeof vi.fn>;
  getDiagramAccessLevel: ReturnType<typeof vi.fn>;
};
const mockUuidv4 = uuidv4 as ReturnType<typeof vi.fn>;

describe("useDiagramEditor", () => {
  let mockNodes: Node[];
  let mockEdges: Edge[];
  let mockSetNodes: Dispatch<SetStateAction<Node[]>>;
  let mockSetEdges: Dispatch<SetStateAction<Edge[]>>;
  let mockUser: { uid: string; email: string };

  beforeEach(() => {
    mockNodes = [];
    mockEdges = [];
    mockSetNodes = vi.fn((updater) => {
      if (typeof updater === "function") {
        mockNodes = updater(mockNodes);
      } else {
        mockNodes = updater;
      }
    }) as Dispatch<SetStateAction<Node[]>>;
    mockSetEdges = vi.fn((updater) => {
      if (typeof updater === "function") {
        mockEdges = updater(mockEdges);
      } else {
        mockEdges = updater;
      }
    }) as Dispatch<SetStateAction<Edge[]>>;
    // Use the same user ID as in the test setup
    mockUser = { uid: "test-user-id", email: "test@example.com" };

    // Reset all mocks
    vi.clearAllMocks();
    mockUuidv4.mockReturnValue("test-uuid-1234");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("addNode", () => {
    it("should add a new node with unique ID", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.addNode();
      });

      expect(mockSetNodes).toHaveBeenCalledTimes(1);
      expect(mockUuidv4).toHaveBeenCalled();
    });

    it("should create node with correct structure", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.addNode();
      });

      const setNodesCall = (mockSetNodes as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const newNodes = setNodesCall([]);

      expect(newNodes).toHaveLength(1);
      expect(newNodes[0]).toMatchObject({
        id: "test-uuid-1234",
        data: { label: "[Node]" },
      });
      expect(newNodes[0].position).toHaveProperty("x");
      expect(newNodes[0].position).toHaveProperty("y");
    });

    it("should append node to existing nodes", () => {
      const existingNodes: Node[] = [
        { id: "node-1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
      ];
      mockNodes = existingNodes;

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.addNode();
      });

      const setNodesCall = (mockSetNodes as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const newNodes = setNodesCall(existingNodes);

      expect(newNodes).toHaveLength(2);
      expect(newNodes[0].id).toBe("node-1");
      expect(newNodes[1].id).toBe("test-uuid-1234");
    });

    it("should generate random positions for new nodes", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.addNode();
      });

      const setNodesCall = (mockSetNodes as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const newNodes = setNodesCall([]);
      const position = newNodes[0].position;

      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThanOrEqual(200);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThanOrEqual(200);
    });
  });

  describe("clearCanvas", () => {
    it("should clear all nodes and edges", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.clearCanvas();
      });

      expect(mockSetNodes).toHaveBeenCalledWith([]);
      expect(mockSetEdges).toHaveBeenCalledWith([]);
    });

    it("should reset current diagram ID", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.clearCanvas();
      });

      expect(result.current.currentDiagramId).toBeNull();
    });

    it("should reset current diagram name", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.clearCanvas();
      });

      expect(result.current.currentDiagramName).toBe("");
    });
  });

  describe("loadDiagram", () => {
    const mockDiagram = {
      id: "diagram-123",
      userId: "test-user-id", // Match the mock user ID from setup
      name: "Test Diagram",
      nodes: [
        { id: "node-1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
      ],
      edges: [{ id: "edge-1", source: "node-1", target: "node-2" }],
    };

    it("should return early if no diagramId provided", async () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("");
      });

      expect(mockDiagramService.getDiagram).not.toHaveBeenCalled();
    });

    it("should set loading state while loading diagram", async () => {
      mockDiagramService.getDiagram.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockDiagram), 100))
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.loadDiagram("diagram-123");
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should load diagram as owner successfully", async () => {
      mockDiagramService.getDiagram.mockResolvedValue(mockDiagram);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockDiagramService.getDiagram).toHaveBeenCalledWith("diagram-123");
      expect(mockSetNodes).toHaveBeenCalledWith(mockDiagram.nodes);
      expect(mockSetEdges).toHaveBeenCalledWith(mockDiagram.edges);
      expect(result.current.currentDiagramId).toBe("diagram-123");
      expect(result.current.currentDiagramName).toBe("Test Diagram");
      expect(mockToast.success).toHaveBeenCalledWith(
        "Loaded diagram: Test Diagram"
      );
    });

    it("should load diagram with shared access", async () => {
      const sharedDiagram = { ...mockDiagram, userId: "other-user-456" };
      mockDiagramService.getDiagram.mockResolvedValue(sharedDiagram);
      mockUserAccessService.hasAccessToDiagram.mockResolvedValue(true);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockUserAccessService.hasAccessToDiagram).toHaveBeenCalled();
      expect(mockSetNodes).toHaveBeenCalledWith(sharedDiagram.nodes);
      expect(mockSetEdges).toHaveBeenCalledWith(sharedDiagram.edges);
      expect(mockToast.success).toHaveBeenCalledWith(
        "Loaded diagram: Test Diagram"
      );
    });

    it("should show error if user lacks permission", async () => {
      const sharedDiagram = { ...mockDiagram, userId: "other-user-456" };
      mockDiagramService.getDiagram.mockResolvedValue(sharedDiagram);
      mockUserAccessService.hasAccessToDiagram.mockResolvedValue(false);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "You don't have permission to access this diagram"
      );
      expect(mockSetNodes).not.toHaveBeenCalled();
      expect(mockSetEdges).not.toHaveBeenCalled();
    });

    it("should show error if diagram not found", async () => {
      mockDiagramService.getDiagram.mockResolvedValue(null);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockToast.error).toHaveBeenCalledWith("Diagram not found");
    });

    it("should handle load errors gracefully", async () => {
      mockDiagramService.getDiagram.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockToast.error).toHaveBeenCalledWith("Failed to load diagram");
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle shared access check errors gracefully", async () => {
      const sharedDiagram = { ...mockDiagram, userId: "other-user-456" };
      mockDiagramService.getDiagram.mockResolvedValue(sharedDiagram);
      mockUserAccessService.hasAccessToDiagram.mockRejectedValue(
        new Error("Access check failed")
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.loadDiagram("diagram-123");
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "You don't have permission to access this diagram"
      );
    });
  });

  describe("saveDiagram", () => {
    it("should return false if diagram name is empty", async () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let saveResult: boolean | undefined;
      await act(async () => {
        saveResult = await result.current.saveDiagram("");
      });

      expect(saveResult).toBe(false);
      expect(mockDiagramService.upsertDiagram).not.toHaveBeenCalled();
    });

    it("should return false if diagram name is only whitespace", async () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let saveResult: boolean | undefined;
      await act(async () => {
        saveResult = await result.current.saveDiagram("   ");
      });

      expect(saveResult).toBe(false);
      expect(mockDiagramService.upsertDiagram).not.toHaveBeenCalled();
    });

    it("should create new diagram when currentDiagramId is null", async () => {
      mockDiagramService.upsertDiagram.mockResolvedValue({
        id: "new-diagram-123",
      });

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let saveResult: boolean | undefined;
      await act(async () => {
        saveResult = await result.current.saveDiagram("My New Diagram");
      });

      expect(mockDiagramService.upsertDiagram).toHaveBeenCalledWith({
        userId: mockUser.uid,
        name: "My New Diagram",
        nodes: mockNodes,
        edges: mockEdges,
      });
      expect(result.current.currentDiagramId).toBe("new-diagram-123");
      expect(result.current.currentDiagramName).toBe("My New Diagram");
      expect(mockToast.success).toHaveBeenCalledWith(
        "Diagram saved successfully!"
      );
      expect(saveResult).toBe(true);
    });

    it("should update existing diagram when currentDiagramId exists", async () => {
      mockDiagramService.upsertDiagram.mockResolvedValue({
        id: "existing-diagram-123",
      });

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      // First, simulate loading a diagram to set currentDiagramId
      const loadedDiagram = {
        id: "existing-diagram-123",
        userId: mockUser.uid,
        name: "Existing Diagram",
        nodes: mockNodes,
        edges: mockEdges,
      };
      mockDiagramService.getDiagram.mockResolvedValue(loadedDiagram);

      await act(async () => {
        await result.current.loadDiagram("existing-diagram-123");
      });

      // Now save with a new name
      let saveResult: boolean | undefined;
      await act(async () => {
        saveResult = await result.current.saveDiagram("Updated Diagram Name");
      });

      expect(mockDiagramService.upsertDiagram).toHaveBeenCalledWith(
        {
          id: "existing-diagram-123",
          userId: mockUser.uid,
          name: "Updated Diagram Name",
          nodes: mockNodes,
          edges: mockEdges,
        },
        true
      );
      expect(result.current.currentDiagramName).toBe("Updated Diagram Name");
      expect(mockToast.success).toHaveBeenCalledWith(
        "Diagram updated successfully!"
      );
      expect(saveResult).toBe(true);
    });

    it("should trim whitespace from diagram name", async () => {
      mockDiagramService.upsertDiagram.mockResolvedValue({ id: "diagram-456" });

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      await act(async () => {
        await result.current.saveDiagram("  My Diagram  ");
      });

      expect(mockDiagramService.upsertDiagram).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "My Diagram",
        })
      );
    });

    it("should set and unset saving state", async () => {
      mockDiagramService.upsertDiagram.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ id: "diagram-789" }), 100)
          )
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.saveDiagram("Test Diagram");
      });

      expect(result.current.isSaving).toBe(true);

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });
    });

    it("should handle save errors gracefully", async () => {
      mockDiagramService.upsertDiagram.mockRejectedValue(
        new Error("Save failed")
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let saveResult: boolean | undefined;
      await act(async () => {
        saveResult = await result.current.saveDiagram("Test Diagram");
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "Error saving diagram. Please try again."
      );
      expect(saveResult).toBe(false);
      expect(result.current.isSaving).toBe(false);
    });
  });

  describe("deleteDiagram", () => {
    it("should return false if no diagramId provided", async () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let deleteResult: boolean | undefined;
      await act(async () => {
        deleteResult = await result.current.deleteDiagram("");
      });

      expect(deleteResult).toBe(false);
      expect(mockDiagramService.deleteDiagram).not.toHaveBeenCalled();
    });

    it("should delete diagram successfully", async () => {
      mockDiagramService.deleteDiagram.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let deleteResult: boolean | undefined;
      await act(async () => {
        deleteResult = await result.current.deleteDiagram("diagram-123");
      });

      expect(mockDiagramService.deleteDiagram).toHaveBeenCalledWith(
        "diagram-123"
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        "Diagram deleted successfully!"
      );
      expect(deleteResult).toBe(true);
    });

    it("should set and unset loading state during deletion", async () => {
      mockDiagramService.deleteDiagram.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      act(() => {
        result.current.deleteDiagram("diagram-123");
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle delete errors gracefully", async () => {
      mockDiagramService.deleteDiagram.mockRejectedValue(
        new Error("Delete failed")
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let deleteResult: boolean | undefined;
      await act(async () => {
        deleteResult = await result.current.deleteDiagram("diagram-123");
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "Error deleting diagram. Please try again."
      );
      expect(deleteResult).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("hasEditAccess", () => {
    it("should return false if no diagramId provided", async () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("");
      });

      expect(hasAccess).toBe(false);
    });

    it("should return true if user is owner", async () => {
      mockDiagramService.isDiagramOwner.mockResolvedValue(true);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("diagram-123");
      });

      expect(mockDiagramService.isDiagramOwner).toHaveBeenCalledWith(
        "diagram-123",
        mockUser.uid
      );
      expect(hasAccess).toBe(true);
    });

    it("should return true if user has edit access", async () => {
      mockDiagramService.isDiagramOwner.mockResolvedValue(false);
      mockUserAccessService.getDiagramAccessLevel.mockResolvedValue("edit");

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("diagram-123");
      });

      expect(mockUserAccessService.getDiagramAccessLevel).toHaveBeenCalledWith(
        mockUser.uid,
        "diagram-123"
      );
      expect(hasAccess).toBe(true);
    });

    it("should return false if user only has view access", async () => {
      mockDiagramService.isDiagramOwner.mockResolvedValue(false);
      mockUserAccessService.getDiagramAccessLevel.mockResolvedValue("view");

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("diagram-123");
      });

      expect(hasAccess).toBe(false);
    });

    it("should return false if user has no access", async () => {
      mockDiagramService.isDiagramOwner.mockResolvedValue(false);
      mockUserAccessService.getDiagramAccessLevel.mockResolvedValue(null);

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("diagram-123");
      });

      expect(hasAccess).toBe(false);
    });

    it("should handle access check errors gracefully", async () => {
      mockDiagramService.isDiagramOwner.mockRejectedValue(
        new Error("Access check failed")
      );

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      let hasAccess: boolean | undefined;
      await act(async () => {
        hasAccess = await result.current.hasEditAccess("diagram-123");
      });

      expect(hasAccess).toBe(false);
    });
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      expect(result.current.isSaving).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.currentDiagramId).toBeNull();
      expect(result.current.currentDiagramName).toBe("");
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle full workflow: create -> save -> load -> update", async () => {
      mockDiagramService.upsertDiagram.mockResolvedValue({ id: "diagram-999" });
      mockDiagramService.getDiagram.mockResolvedValue({
        id: "diagram-999",
        userId: mockUser.uid,
        name: "My Diagram",
        nodes: [
          { id: "node-1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
        ],
        edges: [],
      });

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      // Create new diagram by saving
      await act(async () => {
        await result.current.saveDiagram("My Diagram");
      });

      expect(result.current.currentDiagramId).toBe("diagram-999");

      // Load the diagram
      await act(async () => {
        await result.current.loadDiagram("diagram-999");
      });

      expect(result.current.currentDiagramName).toBe("My Diagram");

      // Update the diagram
      await act(async () => {
        await result.current.saveDiagram("Updated Diagram");
      });

      expect(mockDiagramService.upsertDiagram).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: "diagram-999",
          name: "Updated Diagram",
        }),
        true
      );
    });

    it("should handle clear canvas after loading diagram", async () => {
      mockDiagramService.getDiagram.mockResolvedValue({
        id: "diagram-888",
        userId: mockUser.uid,
        name: "Test Diagram",
        nodes: [
          { id: "node-1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
        ],
        edges: [],
      });

      const { result } = renderHook(() =>
        useDiagramEditor({
          nodes: mockNodes,
          edges: mockEdges,
          setNodes: mockSetNodes,
          setEdges: mockSetEdges,
        })
      );

      // Load diagram
      await act(async () => {
        await result.current.loadDiagram("diagram-888");
      });

      expect(result.current.currentDiagramId).toBe("diagram-888");

      // Clear canvas
      act(() => {
        result.current.clearCanvas();
      });

      expect(result.current.currentDiagramId).toBeNull();
      expect(result.current.currentDiagramName).toBe("");
    });
  });
});
