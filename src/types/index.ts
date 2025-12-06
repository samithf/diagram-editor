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
  // sharedWith?: SharedUser[];
}

export interface DiagramAccess {
  diagramId: string;
  diagramName: string;
  accessLevel: AccessLevel;
  sharedAt: FieldValue;
  sharedBy: string;
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
export type AccessLevel = "view" | "edit";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export interface UserAccess {
  userId: string;
  email: string;
  accessibleDiagrams: {
    diagramId: string;
    diagramName: string;
    accessLevel: AccessLevel;
    sharedAt: FieldValue;
    sharedBy: string; // userId of who shared it
  }[];
}
