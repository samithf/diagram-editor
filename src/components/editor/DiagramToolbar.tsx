import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SaveDiagramDialog } from "./SaveDiagramDialog";

interface DiagramToolbarProps {
  onAddNode: () => void;
  onSave: (name: string) => Promise<boolean>;
  hasNodes: boolean;
  onClearCanvas: () => void;
  currentDiagramName?: string;
  disabled: boolean;
  isUpdating?: boolean;
  diagramOwnerId?: string; // Add owner ID to check ownership
}

export function DiagramToolbar({
  onAddNode,
  onSave,
  hasNodes,
  onClearCanvas,
  currentDiagramName,
  disabled,
  isUpdating = false,
}: DiagramToolbarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="fixed z-10">
      <div className="flex items-center space-x-2 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-md shadow-md dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
        {currentDiagramName && (
          <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {currentDiagramName}
            </span>
          </div>
        )}
        <Button onClick={onAddNode} disabled={disabled}>
          <Plus />
          Add Node
        </Button>
        <SaveDiagramDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={onSave}
          disabled={disabled || !hasNodes}
          defaultName={currentDiagramName}
          isUpdating={isUpdating}
        />
        <Button
          variant="outline"
          onClick={onClearCanvas}
          disabled={disabled || !hasNodes}
        >
          Clear Canvas
        </Button>
      </div>
    </div>
  );
}
