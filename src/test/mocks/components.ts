import { vi } from "vitest";

// Mock DiagramToolbar
vi.mock("@/components/editor/DiagramToolbar", () => ({
  DiagramToolbar: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "diagram-toolbar");
    div.textContent = "Diagram Toolbar";
    return div;
  }),
}));

// Mock ContextMenu
vi.mock("@/components/editor/ContextMenu", () => ({
  ContextMenu: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "context-menu");
    div.textContent = "Context Menu";
    return div;
  }),
}));

// Mock EditableNode
vi.mock("@/components/editor/EditableNode", () => ({
  EditableNode: vi.fn(() => {
    const div = document.createElement("div");
    div.setAttribute("data-testid", "editable-node");
    div.textContent = "Editable Node";
    return div;
  }),
}));

export default {};
