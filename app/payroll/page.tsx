import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PayrollPage() {
  return (
    <DashboardLayout title="Payroll" breadcrumbs={["Home", "Payroll"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payroll Management</h2>
            <p className="text-gray-500">Generate payroll and manage payslips</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Payroll
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Payroll generation interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
