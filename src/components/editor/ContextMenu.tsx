import type { ContextMenu, MenuType } from "@/types";

interface ContextMenuProps {
  contextMenu: ContextMenu;
  onEdgeTypeChange: (edgeId: string, newType: MenuType) => void;
  onEdgeDelete: (edgeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onClose: () => void;
}

const edgeOptions = [
  { value: "default", label: "Default (Curved)" },
  { value: "straight", label: "Straight" },
  { value: "step", label: "Step" },
  { value: "smoothstep", label: "Smooth Step" },
  { value: "bezier", label: "Bezier" },
  { value: "delete", label: "Delete Edge", action: "delete" },
];

const nodeOptions = [
  { value: "delete", label: "Delete Node", action: "delete" },
];

export function ContextMenu({
  contextMenu,
  onEdgeTypeChange,
  onEdgeDelete,
  onNodeDelete,
  onClose,
}: ContextMenuProps) {
  const handleEdgeAction = (option: (typeof edgeOptions)[0]) => {
    if (option.value === "delete") {
      onEdgeDelete(contextMenu.id);
    } else {
      onEdgeTypeChange(contextMenu.id, option.value as MenuType);
    }
    onClose();
  };

  const handleNodeAction = (option: (typeof nodeOptions)[0]) => {
    if (option.value === "delete") {
      onNodeDelete(contextMenu.id);
    }
    onClose();
  };

  return (
    <div
      className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg dark:shadow-gray-900/50 rounded-md py-2 z-50 min-w-40"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      {/* Header */}
      <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {contextMenu.type === "edge" ? "Edge Actions" : "Node Actions"}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
        {contextMenu.type === "edge"
          ? // Edge context menu
            edgeOptions.map((option) => (
              <div key={option.value}>
                {option.value === "delete" && (
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                )}
                <button
                  onClick={() => handleEdgeAction(option)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none ${
                    option.value === "delete"
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              </div>
            ))
          : // Node context menu
            nodeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleNodeAction(option)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:outline-none"
              >
                {option.label}
              </button>
            ))}
      </div>
    </div>
  );
}
