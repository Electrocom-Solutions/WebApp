import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ResourcesPage() {
  return (
    <DashboardLayout title="Resources" breadcrumbs={["Home", "Resources"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Resource Management</h2>
            <p className="text-gray-500">Manage inventory resources and stock</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Resource inventory will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
