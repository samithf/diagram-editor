import type { Edge, Node } from "@xyflow/react";
import type { FieldValue } from "firebase/firestore";

export interface Diagram {
  id: string;
  userId: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface NodeInput {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface ContextMenu {
  type: MenuType;
  id: string;
  x: number;
  y: number;
}

export type MenuType = "edge" | "node";
