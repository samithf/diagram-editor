import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Edge, Node } from "@xyflow/react";
import { DiagramService } from "@/services/DiagramService";
import { UserAccessService } from "@/services/UserAccessService";

interface UseDiagramActionsParams {
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export function useDiagramEditor({
  nodes,
  edges,
  setNodes,
  setEdges,
}: UseDiagramActionsParams) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramName, setCurrentDiagramName] = useState<string>("");
  const { user } = useAuth();

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: uuidv4(),
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label: "[Node]" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentDiagramId(null);
    setCurrentDiagramName("");
  }, [setNodes, setEdges]);

  const loadDiagram = useCallback(
    async (diagramId: string) => {
      if (!diagramId || !user) return;

      setIsLoading(true);
      try {
        const diagram = await DiagramService.getDiagram(diagramId);

        if (diagram) {
          // Check if user is the owner
          const isOwner = diagram.userId === user.uid;

          // Check if user has shared access
          let hasSharedAccess = false;
          if (!isOwner) {
            try {
              hasSharedAccess = await UserAccessService.hasAccessToDiagram(
                user.uid,
                diagramId
              );
            } catch (error) {
              console.error("Error checking shared access:", error);
              hasSharedAccess = false;
            }
          }

          // Verify the user has permission to access this diagram
          if (!isOwner && !hasSharedAccess) {
            toast.error("You don't have permission to access this diagram");
            return;
          }

          // Load the nodes and edges
          setNodes(diagram.nodes);
          setEdges(diagram.edges);
          setCurrentDiagramId(diagramId);
          setCurrentDiagramName(diagram.name);
          toast.success(`Loaded diagram: ${diagram.name}`);
        } else {
          toast.error("Diagram not found");
        }
      } catch (error) {
        console.error("Error loading diagram:", error);
        toast.error("Failed to load diagram");
      } finally {
        setIsLoading(false);
      }
    },
    [user, setNodes, setEdges]
  );

  const saveDiagram = useCallback(
    async (diagramName: string) => {
      if (!diagramName.trim() || !user) return false;

      setIsSaving(true);
      try {
        if (currentDiagramId) {
          // Update existing diagram
          await DiagramService.upsertDiagram(
            {
              id: currentDiagramId,
              userId: user.uid,
              name: diagramName.trim(),
              nodes,
              edges,
            },
            true
          );
          setCurrentDiagramName(diagramName.trim());
          toast.success("Diagram updated successfully!");
        } else {
          const docRef = await DiagramService.upsertDiagram({
            userId: user.uid,
            name: diagramName.trim(),
            nodes,
            edges,
          });

          setCurrentDiagramId(docRef.id);
          setCurrentDiagramName(diagramName.trim());
          toast.success("Diagram saved successfully!");
        }
        return true;
      } catch (error) {
        console.error("Error saving diagram:", error);
        toast.error("Error saving diagram. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [nodes, edges, user, currentDiagramId]
  );

  const deleteDiagram = useCallback(
    async (diagramId: string) => {
      if (!diagramId || !user) return false;

      setIsLoading(true);
      try {
        await DiagramService.deleteDiagram(diagramId);
        toast.success("Diagram deleted successfully!");
        return true;
      } catch (error) {
        console.error("Error deleting diagram:", error);
        toast.error("Error deleting diagram. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const hasEditAccess = useCallback(
    async (diagramId: string) => {
      if (!diagramId || !user) return false;

      try {
        const isOwner = await DiagramService.isDiagramOwner(
          diagramId,
          user.uid
        );
        if (isOwner) return true;

        const accessLevel = await UserAccessService.getDiagramAccessLevel(
          user.uid,
          diagramId
        );

        return accessLevel === "edit";
      } catch (error) {
        console.error("Error checking edit access:", error);
        return false;
      }
    },
    [user]
  );

  return {
    addNode,
    clearCanvas,
    saveDiagram,
    deleteDiagram,
    loadDiagram,
    isSaving,
    isLoading,
    currentDiagramId,
    currentDiagramName,
    hasEditAccess,
  };
}
