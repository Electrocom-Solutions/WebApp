import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ContractWorkersPage() {
  return (
    <DashboardLayout title="Contract Workers" breadcrumbs={["Home", "Contract Workers"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contract Worker Management</h2>
            <p className="text-gray-500">Manage contract workers and bulk imports</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contract Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Contract worker management will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
