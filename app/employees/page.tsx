import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmployeesPage() {
  return (
    <DashboardLayout title="Employees" breadcrumbs={["Home", "Employees"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Employee Management</h2>
            <p className="text-gray-500">Manage employee records and profiles</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Employee directory will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
