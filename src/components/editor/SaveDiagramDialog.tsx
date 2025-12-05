import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SaveDiagramDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<boolean>;
  disabled?: boolean;
  defaultName?: string;
  isUpdating?: boolean;
}

export function SaveDiagramDialog({
  isOpen,
  onOpenChange,
  onSave,
  disabled = false,
  defaultName = "",
  isUpdating = false,
}: SaveDiagramDialogProps) {
  const [diagramName, setDiagramName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);

  // Update diagram name when defaultName changes
  useEffect(() => {
    setDiagramName(defaultName);
  }, [defaultName]);

  const handleSave = async () => {
    if (!diagramName.trim()) return;

    setIsSaving(true);
    try {
      const success = await onSave(diagramName);
      if (success) {
        setDiagramName("");
        onOpenChange(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Save />
          {isUpdating ? "Update" : "Save Diagram"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdating ? "Update Diagram" : "Save Diagram"}
          </DialogTitle>
          <DialogDescription>
            {isUpdating
              ? "Update the name of your diagram:"
              : "Please enter a name for your diagram:"}
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Enter diagram name..."
          value={diagramName}
          onChange={(e) => setDiagramName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isSaving || !diagramName.trim()}
          >
            {isSaving
              ? isUpdating
                ? "Updating..."
                : "Saving..."
              : isUpdating
              ? "Update Diagram"
              : "Save Diagram"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
