import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AttendancePage() {
  return (
    <DashboardLayout title="Attendance" breadcrumbs={["Home", "Attendance"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-gray-500">Track daily attendance and approvals</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Attendance tracking interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
