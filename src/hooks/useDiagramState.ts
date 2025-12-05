import { useState, useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type EdgeMouseHandler,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { ContextMenu, MenuType } from "@/types";

export function useDiagramState() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onEdgeContextMenu: EdgeMouseHandler = useCallback((event, edge) => {
    event.preventDefault();
    setContextMenu({
      type: "edge",
      id: edge.id,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      type: "node",
      id: node.id,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const changeEdgeType = useCallback((edgeId: string, newType: MenuType) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === edgeId ? { ...edge, type: newType } : edge
      )
    );
    setContextMenu(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleEdgeDelete = (edgeId: string) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    // Also remove any connected edges
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  return {
    nodes,
    edges,
    contextMenu,
    setNodes,
    setEdges,
    setContextMenu,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeContextMenu,
    onNodeContextMenu,
    changeEdgeType,
    onPaneClick,
    handleEdgeDelete,
    handleNodeDelete,
  };
}
