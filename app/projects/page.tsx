import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "HT Panel Installation - Site A",
      client: "ABC Power Ltd",
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      status: "In Progress" as const,
    },
    {
      id: 2,
      name: "Transformer Maintenance",
      client: "XYZ Industries",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      status: "Planned" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      Planned: "default",
      "In Progress": "warning",
      "On Hold": "secondary",
      Completed: "success",
      Canceled: "danger",
    } as const;
    return variants[status as keyof typeof variants] || "default";
  };

  return (
    <DashboardLayout title="Projects" breadcrumbs={["Home", "Projects"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Management</h2>
            <p className="text-gray-500">Track ongoing projects and milestones</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        <Card>
          <CardHeader />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-medium">Project Name</th>
                    <th className="p-3 text-left text-sm font-medium">Client</th>
                    <th className="p-3 text-left text-sm font-medium">Start Date</th>
                    <th className="p-3 text-left text-sm font-medium">End Date</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3 font-medium">{project.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{project.client}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{project.startDate}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{project.endDate}</td>
                      <td className="p-3">
                        <Badge variant={getStatusBadge(project.status)}>{project.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
