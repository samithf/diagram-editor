import { MyDiagrams } from "@/components/dashboard/MyDiagrams";
import { SharedDiagrams } from "@/components/dashboard/SharedDiagrams";

export function DashboardHome() {
  return (
    <div className="p-6">
      {/* my diagrams section */}
      <MyDiagrams />

      {/* shared diagram section   */}
      <SharedDiagrams />
    </div>
  );
}
