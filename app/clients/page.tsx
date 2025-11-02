import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export default function ClientsPage() {
  const clients = [
    {
      id: 1,
      name: "ABC Power Ltd",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      activeAmcs: 2,
    },
    {
      id: 2,
      name: "XYZ Industries",
      city: "Gandhinagar",
      state: "Gujarat",
      country: "India",
      activeAmcs: 1,
    },
    {
      id: 3,
      name: "Tech Solutions Pvt Ltd",
      city: "Surat",
      state: "Gujarat",
      country: "India",
      activeAmcs: 0,
    },
  ];

  return (
    <DashboardLayout title="Clients" breadcrumbs={["Home", "Clients"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Client Management</h2>
            <p className="text-gray-500">Manage all your clients and their details</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search clients..."
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
                    <th className="p-3 text-left text-sm font-medium">Name</th>
                    <th className="p-3 text-left text-sm font-medium">City</th>
                    <th className="p-3 text-left text-sm font-medium">State</th>
                    <th className="p-3 text-left text-sm font-medium">Country</th>
                    <th className="p-3 text-left text-sm font-medium">Active AMCs</th>
                    <th className="p-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div className="font-medium">{client.name}</div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{client.city}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{client.state}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{client.country}</td>
                      <td className="p-3">
                        {client.activeAmcs > 0 ? (
                          <Badge variant="success">{client.activeAmcs} Active</Badge>
                        ) : (
                          <Badge variant="secondary">No AMCs</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
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
