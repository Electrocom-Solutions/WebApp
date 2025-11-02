import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
  return (
    <DashboardLayout title="Tasks" breadcrumbs={["Home", "Tasks"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Task Management</h2>
            <p className="text-gray-500">Track employee tasks and field work</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Task management interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
