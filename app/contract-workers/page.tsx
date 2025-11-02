"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Edit, Trash2, X, User, Phone, MapPin } from "lucide-react";

type ContractWorker = {
  id: number;
  name: string;
  worker_id: string;
  phone: string;
  skill: string;
  daily_rate: number;
  address?: string;
  assigned_to?: string;
  status: "Available" | "Assigned" | "Inactive";
  created_at: string;
};

const mockWorkers: ContractWorker[] = [
  {
    id: 1,
    name: "Ram Prakash",
    worker_id: "CW-001",
    phone: "+91 98765 11111",
    skill: "Electrician",
    daily_rate: 800,
    address: "Andheri, Mumbai",
    status: "Available",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Vikram Singh",
    worker_id: "CW-002",
    phone: "+91 98765 22222",
    skill: "Welder",
    daily_rate: 900,
    address: "Thane, Mumbai",
    assigned_to: "BSNL Network Project",
    status: "Assigned",
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: 3,
    name: "Sunil Kumar",
    worker_id: "CW-003",
    phone: "+91 98765 33333",
    skill: "Fitter",
    daily_rate: 750,
    address: "Vashi, Navi Mumbai",
    status: "Available",
    created_at: "2025-01-10T00:00:00Z",
  },
];

export default function ContractWorkersPage() {
  const [workers, setWorkers] = useState<ContractWorker[]>(mockWorkers);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<ContractWorker | null>(null);

  const skills = ["all", ...Array.from(new Set(workers.map(w => w.skill)))];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = searchQuery === "" ||
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.worker_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.includes(searchQuery);
    
    const matchesSkill = skillFilter === "all" || worker.skill === skillFilter;
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    
    return matchesSearch && matchesSkill && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      setWorkers(prev => prev.filter(w => w.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Assigned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <DashboardLayout title="Contract Workers" breadcrumbs={["Home", "People", "Contract Workers"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contract Worker Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage contract workers and bulk imports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBulkImport(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button onClick={() => {
              setSelectedWorker(null);
              setShowModal(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Worker
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Workers</div>
            <div className="text-2xl font-bold mt-1">{workers.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {workers.filter(w => w.status === "Available").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Assigned</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {workers.filter(w => w.status === "Assigned").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Daily Rate</div>
            <div className="text-2xl font-bold mt-1 text-sky-600">
              ₹{Math.round(workers.reduce((sum, w) => sum + w.daily_rate, 0) / workers.length)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search workers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {skills.map(skill => (
              <option key={skill} value={skill}>
                {skill === "all" ? "All Skills" : skill}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Daily Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <div className="font-medium">{worker.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{worker.worker_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {worker.phone}
                    </div>
                    {worker.address && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {worker.address}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{worker.skill}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ₹{worker.daily_rate}/day
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {worker.assigned_to || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(worker.status)}>
                      {worker.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedWorker(worker);
                          setShowModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(worker.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <WorkerModal
          worker={selectedWorker}
          onClose={() => setShowModal(false)}
          onSave={(worker) => {
            if (selectedWorker) {
              setWorkers(prev => prev.map(w => w.id === worker.id ? worker : w));
            } else {
              setWorkers(prev => [worker, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}

      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onImport={(newWorkers) => {
            setWorkers(prev => [...newWorkers, ...prev]);
            setShowBulkImport(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function WorkerModal({ worker, onClose, onSave }: {
  worker: ContractWorker | null;
  onClose: () => void;
  onSave: (worker: ContractWorker) => void;
}) {
  const [formData, setFormData] = useState({
    name: worker?.name || "",
    worker_id: worker?.worker_id || `CW-${Date.now().toString().slice(-3)}`,
    phone: worker?.phone || "",
    skill: worker?.skill || "Electrician",
    daily_rate: worker?.daily_rate?.toString() || "",
    address: worker?.address || "",
    assigned_to: worker?.assigned_to || "",
    status: worker?.status || "Available",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedWorker: ContractWorker = {
      id: worker?.id || Date.now(),
      ...formData,
      daily_rate: parseInt(formData.daily_rate),
      created_at: worker?.created_at || new Date().toISOString(),
    };
    onSave(savedWorker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">
            {worker ? "Edit Worker" : "Add Worker"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Worker ID</label>
              <Input value={formData.worker_id} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone <span className="text-red-500">*</span></label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skill</label>
              <select
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="Electrician">Electrician</option>
                <option value="Welder">Welder</option>
                <option value="Fitter">Fitter</option>
                <option value="Helper">Helper</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Daily Rate (₹)</label>
              <Input
                type="number"
                value={formData.daily_rate}
                onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assigned To</label>
              <Input
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {worker ? "Update" : "Add"} Worker
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BulkImportModal({ onClose, onImport }: {
  onClose: () => void;
  onImport: (workers: ContractWorker[]) => void;
}) {
  const [csvData, setCsvData] = useState("");

  const handleImport = () => {
    const sampleWorkers: ContractWorker[] = [
      { id: Date.now() + 1, name: "Sample Worker 1", worker_id: "CW-101", phone: "+91 98765 44444", skill: "Electrician", daily_rate: 850, status: "Available", created_at: new Date().toISOString() },
      { id: Date.now() + 2, name: "Sample Worker 2", worker_id: "CW-102", phone: "+91 98765 55555", skill: "Welder", daily_rate: 950, status: "Available", created_at: new Date().toISOString() },
    ];
    onImport(sampleWorkers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">Bulk Import Workers</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Format: Name, Phone, Skill, Daily Rate, Address
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import Workers (Sample)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
