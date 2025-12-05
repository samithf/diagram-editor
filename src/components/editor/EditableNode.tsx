import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

interface EditableNodeProps {
  data: { label: string };
}

export function EditableNode({ data }: EditableNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    // Update the actual data object
    Object.assign(data, { label });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div className="px-4 py-2 shadow-md dark:shadow-gray-900/50 rounded-md bg-white dark:bg-gray-800 border border-stone-500 dark:border-gray-600 min-w-[100px] relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: "#555",
          width: "8px",
          height: "8px",
          border: "1px solid #fff",
        }}
      />
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyPress}
          autoFocus
          className="nodrag border-none outline-none bg-transparent w-full text-center text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer text-center text-gray-900 dark:text-gray-100"
        >
          {data.label}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "#555",
          width: "8px",
          height: "8px",
          border: "1px solid #fff",
        }}
      />
    </div>
  );
}
