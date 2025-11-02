import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaskResourcesPage() {
  return (
    <DashboardLayout title="Task Resources" breadcrumbs={["Home", "Task Resources"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Task Resources</h2>
          <p className="text-gray-500">Resource consumption per task</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Task resource tracking will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
