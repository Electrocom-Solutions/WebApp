import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, FileText } from "lucide-react";

export default function TendersPage() {
  const tenders = [
    {
      id: 1,
      name: "HT Panel Installation",
      referenceNumber: "TND/ER/001/2025",
      filedDate: "2025-02-05",
      estimatedValue: 5000000,
      status: "Filed" as const,
    },
    {
      id: 2,
      name: "Power Transformer Maintenance",
      referenceNumber: "TND/ER/002/2025",
      filedDate: "2025-01-28",
      estimatedValue: 3500000,
      status: "Awarded" as const,
    },
    {
      id: 3,
      name: "Electrical Panel Supply",
      referenceNumber: "TND/ER/025/2024",
      filedDate: "2024-12-15",
      estimatedValue: 2000000,
      status: "Lost" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      Filed: "default",
      Awarded: "success",
      Lost: "danger",
      Closed: "secondary",
    } as const;
    return variants[status as keyof typeof variants] || "default";
  };

  return (
    <DashboardLayout title="Tenders" breadcrumbs={["Home", "Tenders"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tender Management</h2>
            <p className="text-gray-500">Track tender submissions and EMD deposits</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tender
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search tenders..."
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
                    <th className="p-3 text-left text-sm font-medium">Tender Name</th>
                    <th className="p-3 text-left text-sm font-medium">Reference No.</th>
                    <th className="p-3 text-left text-sm font-medium">Filed Date</th>
                    <th className="p-3 text-left text-sm font-medium">Estimated Value</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((tender) => (
                    <tr key={tender.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div className="font-medium">{tender.name}</div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        {tender.referenceNumber}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{tender.filedDate}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        ₹{tender.estimatedValue.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge variant={getStatusBadge(tender.status)}>{tender.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Documents">
                            <FileText className="h-4 w-4" />
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
