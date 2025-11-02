import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" breadcrumbs={["Home", "Settings"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-gray-500">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Company information and basic settings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Defaults</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Default billing cycles and payment terms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Third-party integrations and APIs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">User roles and permissions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
