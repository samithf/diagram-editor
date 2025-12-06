import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Trash2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import type { Diagram } from "@/types";
import { formatDate } from "@/lib/date";
import { DiagramService } from "@/services/DiagramService";
import { ShareDiagramDialog } from "@/components/editor/ShareDiagramDialog";
import { useState } from "react";

export interface DiagramCardProps {
  diagram: Diagram;
  onDelete: (diagramId: string) => void;
}

export function DiagramCard({ diagram, onDelete }: DiagramCardProps) {
  const navigate = useNavigate();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDialogClosing, setIsDialogClosing] = useState(false);

  const handleCardClick = () => {
    // Don't navigate if the share dialog is open or closing
    if (isShareDialogOpen || isDialogClosing) return;
    navigate(`/editor/${diagram.id}`);
  };

  const handleShareDialogChange = (open: boolean) => {
    if (!open) {
      setIsDialogClosing(true);
      // Clear the closing flag after a short delay
      setTimeout(() => {
        setIsDialogClosing(false);
        setIsShareDialogOpen(false);
      }, 200);
    } else {
      setIsDialogClosing(false);
      setIsShareDialogOpen(true);
    }
  };

  const deleteDiagram = async (
    diagramId: string,
    diagramName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${diagramName}"?`
    );

    if (!confirmDelete) return;

    try {
      await DiagramService.deleteDiagram(diagramId);
      onDelete(diagramId);

      toast.success(`"${diagramName}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting diagram:", error);
      toast.error("Failed to delete diagram. Please try again.");
    }
  };

  return (
    <>
      <Card
        key={diagram.id}
        className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-gray-900 dark:text-gray-100">
                {diagram.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={(e) => {
                  deleteDiagram(diagram.id, diagram.name, e);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareDialogOpen(true);
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <ShareDiagramDialog
                isOpen={isShareDialogOpen}
                onOpenChange={handleShareDialogChange}
                diagramId={diagram.id}
                diagramName={diagram.name}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(diagram.createdAt)}</span>
            </div>
            <div className="flex gap-4 text-xs">
              <span>{diagram.nodes?.length || 0} nodes</span>
              <span>{diagram.edges?.length || 0} edges</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
