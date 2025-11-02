"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Package, IndianRupee, AlertCircle } from "lucide-react";

type TaskResourceSummary = {
  task_id: number;
  task_date: string;
  employee_name: string;
  client_name: string;
  project_name: string;
  location: string;
  total_resources: number;
  total_cost: number;
  resources: {
    name: string;
    quantity: number;
    unit_cost: number;
    total: number;
  }[];
};

const mockTaskResources: TaskResourceSummary[] = [
  {
    task_id: 247,
    task_date: "2025-11-01",
    employee_name: "Rajesh Kumar",
    client_name: "BSNL",
    project_name: "Network Expansion",
    location: "Andheri West",
    total_resources: 5,
    total_cost: 45750,
    resources: [
      { name: "Network Cable (Cat6)", quantity: 500, unit_cost: 15, total: 7500 },
      { name: "RJ45 Connectors", quantity: 50, unit_cost: 5, total: 250 },
      { name: "Network Switch (24-port)", quantity: 2, unit_cost: 12000, total: 24000 },
      { name: "Cable Tray", quantity: 20, unit_cost: 250, total: 5000 },
      { name: "Patch Panel (48-port)", quantity: 1, unit_cost: 9000, total: 9000 },
    ],
  },
  {
    task_id: 248,
    task_date: "2025-11-01",
    employee_name: "Amit Patel",
    client_name: "DataNet Solutions",
    project_name: "Server Room Setup",
    location: "Powai",
    total_resources: 3,
    total_cost: 180000,
    resources: [
      { name: "Network Switch (24-port)", quantity: 4, unit_cost: 12000, total: 48000 },
      { name: "Fiber Optic Cable", quantity: 200, unit_cost: 45, total: 9000 },
      { name: "Patch Panel (48-port)", quantity: 3, unit_cost: 9000, total: 27000 },
    ],
  },
  {
    task_id: 250,
    task_date: "2025-10-31",
    employee_name: "Suresh Reddy",
    client_name: "PowerGrid",
    project_name: "Transformer Maintenance",
    location: "Thane",
    total_resources: 4,
    total_cost: 12500,
    resources: [
      { name: "Cable Tray", quantity: 10, unit_cost: 250, total: 2500 },
      { name: "Network Cable (Cat6)", quantity: 200, unit_cost: 15, total: 3000 },
      { name: "RJ45 Connectors", quantity: 100, unit_cost: 5, total: 500 },
      { name: "Testing Equipment", quantity: 1, unit_cost: 6500, total: 6500 },
    ],
  },
];

export default function TaskResourcesPage() {
  const [taskResources, setTaskResources] = useState<TaskResourceSummary[]>(mockTaskResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const handleGenerateReport = () => {
    const csvContent = [
      ["Task ID", "Date", "Employee", "Client", "Project", "Location", "Resources Used", "Total Cost"].join(","),
      ...filteredTasks.map(task => [
        task.task_id,
        task.task_date,
        task.employee_name,
        task.client_name,
        task.project_name,
        task.location,
        task.total_resources,
        task.total_cost
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `task-resources-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTasks = taskResources.filter(task =>
    searchQuery === "" ||
    task.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCost = filteredTasks.reduce((sum, task) => sum + task.total_cost, 0);
  const totalResources = filteredTasks.reduce((sum, task) => sum + task.total_resources, 0);
  const avgCostPerTask = filteredTasks.length > 0 ? totalCost / filteredTasks.length : 0;

  return (
    <DashboardLayout title="Task Resources" breadcrumbs={["Home", "Inventory", "Task Resources"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Task Resource Consumption</h2>
            <p className="text-gray-500 dark:text-gray-400">Track resource usage per task for cost analysis</p>
          </div>
          <Button onClick={handleGenerateReport}>
            <Package className="h-4 w-4 mr-2" />
            Resource Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
                <div className="text-2xl font-bold mt-1">{filteredTasks.length}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-sky-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Resources Used</div>
                <div className="text-2xl font-bold mt-1">{totalResources}</div>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Cost</div>
                <div className="text-2xl font-bold mt-1">₹{(totalCost / 100000).toFixed(2)}L</div>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Cost/Task</div>
                <div className="text-2xl font-bold mt-1">₹{avgCostPerTask.toLocaleString()}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by employee, client, project, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTask === task.task_id;

            return (
              <div
                key={task.task_id}
                className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => setExpandedTask(isExpanded ? null : task.task_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Task #{task.task_id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(task.task_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-1 font-semibold">{task.employee_name}</div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {task.client_name} • {task.project_name} • {task.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Resources Used</div>
                        <div className="text-lg font-semibold">{task.total_resources}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Cost</div>
                        <div className="text-lg font-semibold text-sky-600">
                          ₹{task.total_cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 p-4">
                    <h4 className="font-semibold mb-3">Resource Breakdown</h4>
                    <table className="min-w-full">
                      <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        <tr>
                          <th className="text-left pb-2">Resource Name</th>
                          <th className="text-right pb-2">Quantity</th>
                          <th className="text-right pb-2">Unit Cost</th>
                          <th className="text-right pb-2">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {task.resources.map((resource, idx) => (
                          <tr key={idx} className="border-t dark:border-gray-700">
                            <td className="py-2">{resource.name}</td>
                            <td className="py-2 text-right">{resource.quantity}</td>
                            <td className="py-2 text-right">₹{resource.unit_cost}</td>
                            <td className="py-2 text-right font-medium">₹{resource.total.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 dark:border-gray-600 font-semibold">
                          <td className="py-2" colSpan={3}>Total</td>
                          <td className="py-2 text-right text-sky-600">
                            ₹{task.total_cost.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
