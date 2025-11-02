import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports" breadcrumbs={["Home", "Reports"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-gray-500">Pre-built reports and custom analytics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>AMC Billing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">View AMC billing statistics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tender Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Track tender status and success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Employee productivity metrics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
