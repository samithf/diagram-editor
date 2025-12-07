import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Eye, Edit, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AccessLevel, DiagramAccess } from "@/types";
import { formatDate } from "@/lib/date";

export interface DiagramAccessCardProps {
  diagramAccess: DiagramAccess;
}

export function DiagramAccessCard({ diagramAccess }: DiagramAccessCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/editor/${diagramAccess.diagramId}`);
  };

  const getAccessIcon = (accessLevel: AccessLevel) => {
    return accessLevel === "edit" ? (
      <Edit className="w-4 h-4" />
    ) : (
      <Eye className="w-4 h-4" />
    );
  };

  const getAccessColor = (accessLevel: AccessLevel) => {
    return accessLevel === "edit"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
  };

  return (
    <Card
      className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900 dark:text-gray-100">
              {diagramAccess.diagramName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`flex items-center gap-1 ${getAccessColor(
                diagramAccess.accessLevel
              )}`}
            >
              {getAccessIcon(diagramAccess.accessLevel)}
              {diagramAccess.accessLevel}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Shared: {formatDate(diagramAccess.sharedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
