import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Mail } from "lucide-react";

export default function AMCsPage() {
  const amcs = [
    {
      id: 1,
      amcNumber: "AMC/2025/001",
      client: "ABC Power Ltd",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      amount: 500000,
      status: "Active" as const,
      billingCycle: "Quarterly",
    },
    {
      id: 2,
      amcNumber: "AMC/2024/028",
      client: "XYZ Industries",
      startDate: "2024-06-01",
      endDate: "2025-11-15",
      amount: 300000,
      status: "Active" as const,
      billingCycle: "Monthly",
    },
    {
      id: 3,
      amcNumber: "AMC/2024/015",
      client: "Tech Solutions Pvt Ltd",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      amount: 450000,
      status: "Expired" as const,
      billingCycle: "Half-yearly",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "success",
      Pending: "warning",
      Expired: "danger",
      Canceled: "secondary",
    } as const;
    return variants[status as keyof typeof variants] || "default";
  };

  return (
    <DashboardLayout title="AMCs" breadcrumbs={["Home", "AMCs"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AMC Management</h2>
            <p className="text-gray-500">Annual Maintenance Contracts and billing</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create AMC
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search AMCs..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-medium">AMC Number</th>
                    <th className="p-3 text-left text-sm font-medium">Client</th>
                    <th className="p-3 text-left text-sm font-medium">Start Date</th>
                    <th className="p-3 text-left text-sm font-medium">End Date</th>
                    <th className="p-3 text-left text-sm font-medium">Amount</th>
                    <th className="p-3 text-left text-sm font-medium">Billing Cycle</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {amcs.map((amc) => (
                    <tr key={amc.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div className="font-medium">{amc.amcNumber}</div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{amc.client}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{amc.startDate}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{amc.endDate}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        ₹{amc.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{amc.billingCycle}</td>
                      <td className="p-3">
                        <Badge variant={getStatusBadge(amc.status)}>{amc.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Send Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
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
