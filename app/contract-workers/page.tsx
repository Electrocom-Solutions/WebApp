"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Edit, Trash2, X, User, Phone, MapPin } from "lucide-react";
import { showDeleteConfirm } from "@/lib/sweetalert";

type ContractWorker = {
  id: number;
  name: string;
  worker_id: string;
  phone: string;
  designation: string;
  monthly_salary: number;
  address?: string;
  project_id?: number;
  project_name?: string;
  status: "Available" | "Assigned" | "Inactive";
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  uan_number?: string;
  aadhar_number?: string;
  created_at: string;
};

type Project = {
  id: number;
  name: string;
};

const mockProjects: Project[] = [
  { id: 1, name: "BSNL Network Project" },
  { id: 2, name: "Reliance Telecom Tower" },
  { id: 3, name: "Vodafone Network Expansion" },
  { id: 4, name: "Airtel Fiber Installation" },
];

const mockWorkers: ContractWorker[] = [
  {
    id: 1,
    name: "Ram Prakash",
    worker_id: "CW-001",
    phone: "+91 98765 11111",
    designation: "Electrician",
    monthly_salary: 24000,
    address: "Andheri, Mumbai",
    status: "Available",
    bank_name: "State Bank of India",
    bank_account_number: "1234567890",
    bank_ifsc: "SBIN0001234",
    uan_number: "101234567890",
    aadhar_number: "1234 5678 9012",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Vikram Singh",
    worker_id: "CW-002",
    phone: "+91 98765 22222",
    designation: "Supervisor",
    monthly_salary: 35000,
    address: "Thane, Mumbai",
    project_id: 1,
    project_name: "BSNL Network Project",
    status: "Assigned",
    bank_name: "HDFC Bank",
    bank_account_number: "0987654321",
    bank_ifsc: "HDFC0001234",
    uan_number: "101234567891",
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: 3,
    name: "Sunil Kumar",
    worker_id: "CW-003",
    phone: "+91 98765 33333",
    designation: "Fitter",
    monthly_salary: 22000,
    address: "Vashi, Navi Mumbai",
    status: "Available",
    aadhar_number: "9876 5432 1098",
    created_at: "2025-01-10T00:00:00Z",
  },
];

export default function ContractWorkersPage() {
  const [workers, setWorkers] = useState<ContractWorker[]>(mockWorkers);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<ContractWorker | null>(null);

  const designations = ["all", ...Array.from(new Set(workers.map(w => w.designation)))];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = searchQuery === "" ||
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.worker_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.includes(searchQuery);
    
    const matchesDesignation = designationFilter === "all" || worker.designation === designationFilter;
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    
    return matchesSearch && matchesDesignation && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    const confirmed = await showDeleteConfirm("this worker");
    if (confirmed) {
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
            <div className="text-sm text-gray-500 dark:text-gray-400">Total of All Salaries</div>
            <div className="text-2xl font-bold mt-1 text-sky-600">
              ₹{workers.reduce((sum, w) => sum + w.monthly_salary, 0).toLocaleString('en-IN')}
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
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {designations.map(designation => (
              <option key={designation} value={designation}>
                {designation === "all" ? "All Designations" : designation}
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
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Monthly Salary
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
                    <Badge variant="secondary">{worker.designation}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium dark:text-gray-200">
                    ₹{worker.monthly_salary.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {worker.project_name || "-"}
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
    designation: worker?.designation || "Electrician",
    monthly_salary: worker?.monthly_salary?.toString() || "",
    address: worker?.address || "",
    project_id: worker?.project_id || 0,
    status: worker?.status || "Available",
    bank_name: worker?.bank_name || "",
    bank_account_number: worker?.bank_account_number || "",
    bank_ifsc: worker?.bank_ifsc || "",
    uan_number: worker?.uan_number || "",
    aadhar_number: worker?.aadhar_number || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProject = mockProjects.find(p => p.id === formData.project_id);
    const savedWorker: ContractWorker = {
      id: worker?.id || Date.now(),
      name: formData.name,
      worker_id: formData.worker_id,
      phone: formData.phone,
      designation: formData.designation,
      monthly_salary: parseInt(formData.monthly_salary),
      address: formData.address || undefined,
      project_id: formData.project_id > 0 ? formData.project_id : undefined,
      project_name: selectedProject ? selectedProject.name : undefined,
      status: formData.status,
      bank_name: formData.bank_name || undefined,
      bank_account_number: formData.bank_account_number || undefined,
      bank_ifsc: formData.bank_ifsc || undefined,
      uan_number: formData.uan_number || undefined,
      aadhar_number: formData.aadhar_number || undefined,
      created_at: worker?.created_at || new Date().toISOString(),
    };
    onSave(savedWorker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-semibold">
            {worker ? "Edit Worker" : "Add Worker"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Worker ID</label>
              <Input value={formData.worker_id} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Phone <span className="text-red-500">*</span></label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-gray-200"
              >
                <option value="Electrician">Electrician</option>
                <option value="Helper">Helper</option>
                <option value="Fitter">Fitter</option>
                <option value="Technician">Technician</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Monthly Salary (₹) <span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={formData.monthly_salary}
                onChange={(e) => setFormData({ ...formData, monthly_salary: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-gray-200"
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Assigned Project</label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-gray-200"
              >
                <option value={0}>Not Assigned</option>
                {mockProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t dark:border-gray-800 pt-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Bank Details & ID Proof</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Bank Name</label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="e.g., State Bank of India"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Account Number</label>
                <Input
                  value={formData.bank_account_number}
                  onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                  placeholder="Account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">IFSC Code</label>
                <Input
                  value={formData.bank_ifsc}
                  onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value })}
                  placeholder="e.g., SBIN0001234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">UAN Number</label>
                <Input
                  value={formData.uan_number}
                  onChange={(e) => setFormData({ ...formData, uan_number: e.target.value })}
                  placeholder="Universal Account Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Aadhar Card Number</label>
                <Input
                  value={formData.aadhar_number}
                  onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })}
                  placeholder="XXXX XXXX XXXX"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
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
      { id: Date.now() + 1, name: "Sample Worker 1", worker_id: "CW-101", phone: "+91 98765 44444", designation: "Electrician", monthly_salary: 25000, status: "Available", created_at: new Date().toISOString() },
      { id: Date.now() + 2, name: "Sample Worker 2", worker_id: "CW-102", phone: "+91 98765 55555", designation: "Fitter", monthly_salary: 28000, status: "Available", created_at: new Date().toISOString() },
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
