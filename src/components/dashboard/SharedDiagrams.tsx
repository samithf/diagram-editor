import { useAuth } from "@/context/AuthContext";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { DiagramAccess } from "@/types";

import { UserAccessService } from "@/services/UserAccessService";
import { DiagramAccessCard } from "./DiagramAccessCard";

export function SharedDiagrams() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sharedDiagrams, setSharedDiagrams] = useState<DiagramAccess[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedDiagrams();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSharedDiagrams = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const sharedDiagrams = await UserAccessService.getSharedDiagramsForUser(
        user.uid
      );
      setSharedDiagrams(sharedDiagrams);
      console.log("Fetched shared diagrams:", sharedDiagrams);
    } catch (err) {
      console.error("Error fetching shared diagrams:", err);
      setError("Failed to load shared diagrams");
    } finally {
      setLoading(false);
    }
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
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Shared With Me
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {sharedDiagrams.length} shared diagram
            {sharedDiagrams.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Shared Diagrams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedDiagrams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No shared diagrams
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Diagrams shared with you will appear here
            </p>
          </div>
        ) : (
          sharedDiagrams.map((diagramAccess) => (
            <DiagramAccessCard
              key={diagramAccess.diagramId}
              diagramAccess={diagramAccess}
            />
          ))
        )}
      </div>
    </div>
  );
}
