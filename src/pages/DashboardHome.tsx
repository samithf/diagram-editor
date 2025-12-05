import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Plus, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Diagram } from "@/types";
import { DiagramCard } from "@/components/dashboard/DiagramCard";
import { DiagramService } from "@/services/DiagramService";

export function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's diagrams
  const fetchDiagrams = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const diagrams = await DiagramService.fetchAllDiagramsForUser(user.uid);
      console.log("Fetched diagrams:", diagrams);
      setDiagrams(diagrams);
    } catch (err) {
      console.error("Error fetching diagrams:", err);
      setError("Failed to load diagrams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDeleteDiagram = async (diagramId: string) => {
    setDiagrams((prevDiagrams) =>
      prevDiagrams.filter((diagram) => diagram.id !== diagramId)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading diagrams...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Diagrams
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {diagrams.length} diagram{diagrams.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => navigate("/editor")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Diagram
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Diagrams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagrams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No diagrams yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first diagram to get started
            </p>
            <Button onClick={() => navigate("/editor")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Diagram
            </Button>
          </div>
        ) : (
          diagrams.map((diagram) => (
            <DiagramCard
              key={diagram.id}
              diagram={diagram}
              onDelete={onDeleteDiagram}
            />
          ))
        )}
      </div>
    </div>
  );
}
