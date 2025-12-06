import { Background, Controls, ReactFlow } from "@xyflow/react";
import { useDiagramState } from "@/hooks/useDiagramState";
import { useDiagramEditor } from "@/hooks/useDiagramEditor";
import { DiagramToolbar } from "@/components/editor/DiagramToolbar";
import { ContextMenu } from "@/components/editor/ContextMenu";
import { EditableNode } from "@/components/editor/EditableNode";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const nodeTypes = {
  default: EditableNode,
  input: EditableNode,
};

export function DiagramEditor() {
  const { diagramId } = useParams();
  const { theme } = useTheme();

  const {
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
  } = useDiagramState();

  const {
    addNode,
    saveDiagram,
    clearCanvas,
    loadDiagram,
    isLoading,
    currentDiagramId,
    currentDiagramName,
    hasEditAccess,
  } = useDiagramEditor({
    nodes,
    edges,
    setNodes,
    setEdges,
  });

  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);

  useEffect(() => {
    if (diagramId) {
      loadDiagram(diagramId);
    }
  }, [diagramId, loadDiagram]);

  useEffect(() => {
    const checkEditAccess = async () => {
      if (diagramId) {
        const access = await hasEditAccess(diagramId);
        console.log("User has edit access:", access);
        setHasEditPermission(access);
      }
    };
    checkEditAccess();
  }, [diagramId, hasEditAccess, hasEditPermission]);

  return (
    <div className="h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-lg">Loading diagram...</div>
        </div>
      )}

      <DiagramToolbar
        onAddNode={addNode}
        onSave={saveDiagram}
        hasNodes={nodes.length > 0}
        onClearCanvas={clearCanvas}
        currentDiagramName={currentDiagramName}
        disabled={!hasEditPermission}
        isUpdating={!!currentDiagramId}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        colorMode={theme}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          contextMenu={contextMenu}
          onEdgeTypeChange={changeEdgeType}
          onEdgeDelete={handleEdgeDelete}
          onNodeDelete={handleNodeDelete}
          onClose={() => setContextMenu(null)}
          disabled={!hasEditPermission}
        />
      )}
    </div>
  );
}
