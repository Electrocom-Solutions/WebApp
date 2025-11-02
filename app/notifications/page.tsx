import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "AMC Expiry Alert",
      message: "ABC Power Ltd AMC expires in 7 days",
      type: "AMC" as const,
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      title: "New Task Assigned",
      message: "Panel installation at Site B",
      type: "Task" as const,
      time: "5 hours ago",
      isRead: false,
    },
    {
      id: 3,
      title: "Tender Deadline",
      message: "Tender TND/ER/001/2025 ends tomorrow",
      type: "Tender" as const,
      time: "1 day ago",
      isRead: true,
    },
  ];

  return (
    <DashboardLayout title="Notifications" breadcrumbs={["Home", "Notifications"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-gray-500">View all system notifications and alerts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 ${
                    !notification.isRead ? "bg-sky-50 dark:bg-sky-900/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-sky-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                    <Badge variant="secondary">{notification.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
