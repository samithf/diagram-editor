import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/services/UserService";
import { UserAccessService } from "@/services/UserAccessService";

interface ShareDiagramDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  diagramId: string;
  diagramName: string;
}

export function ShareDiagramDialog({
  isOpen,
  onOpenChange,
  diagramId,
  diagramName,
}: ShareDiagramDialogProps) {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"view" | "edit">("view");
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange(false);
    } else {
      onOpenChange(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setAccessLevel("view");
    }
  }, [isOpen, diagramId]);

  const handleShare = async () => {
    if (!email.trim()) {
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (email.trim() === user?.email) {
      toast.error("You cannot share the diagram with yourself");
      return;
    }

    const userToBeShared = await UserService.getUserByEmail(email.trim());
    if (!userToBeShared) {
      toast.error("No user found with this email address");
      return;
    }

    setIsSharing(true);
    try {
      const response = await UserAccessService.shareDiagramWithUser({
        userId: userToBeShared.id,
        diagramId,
        email: email.trim(),
        accessLevel,
        sharedBy: user?.uid || "",
      });

      if (response.success) {
        setEmail("");
        setAccessLevel("view");
        toast.success(response.message);
        return;
      }

      toast.error(response.message);
    } catch (error) {
      console.error("Error sharing diagram:", error);
      toast.error("Failed to share diagram. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleShare();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Share "{diagramName}"
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Invite others to view or edit this diagram
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share by email */}
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300">
              Invite by email
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Select
                value={accessLevel}
                onValueChange={(value: "view" | "edit") =>
                  setAccessLevel(value)
                }
              >
                <SelectTrigger className="w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="view"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View
                  </SelectItem>
                  <SelectItem
                    value="edit"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleShare}
              disabled={isSharing || !email.trim()}
              className="w-full"
            >
              {isSharing ? "Sharing..." : "Send Invitation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
