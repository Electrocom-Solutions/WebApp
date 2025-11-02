import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmailTemplatesPage() {
  return (
    <DashboardLayout title="Email Templates" breadcrumbs={["Home", "Email Templates"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Email Templates</h2>
            <p className="text-gray-500">Manage email templates with placeholders</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Email template management will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
