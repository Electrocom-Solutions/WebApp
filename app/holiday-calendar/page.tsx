import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HolidayCalendarPage() {
  return (
    <DashboardLayout title="Holiday Calendar" breadcrumbs={["Home", "Holiday Calendar"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Holiday Calendar</h2>
            <p className="text-gray-500">Manage holidays and leave calendar</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Holiday calendar will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
