"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, MapPin, Edit, Trash2, X, User, Briefcase } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  employee_id: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joining_date: string;
  status: "Active" | "On Leave" | "Terminated";
  salary: number;
  address?: string;
  emergency_contact?: string;
  created_at: string;
};

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    employee_id: "EMP-001",
    email: "rajesh@electrocom.in",
    phone: "+91 98765 43210",
    department: "Technical",
    role: "Senior Engineer",
    joining_date: "2020-01-15",
    status: "Active",
    salary: 45000,
    address: "Mumbai, Maharashtra",
    emergency_contact: "+91 98765 43211",
    created_at: "2020-01-15T00:00:00Z",
  },
  {
    id: 2,
    name: "Priya Sharma",
    employee_id: "EMP-002",
    email: "priya@electrocom.in",
    phone: "+91 98765 43220",
    department: "Administration",
    role: "Office Manager",
    joining_date: "2021-03-20",
    status: "Active",
    salary: 35000,
    address: "Mumbai, Maharashtra",
    created_at: "2021-03-20T00:00:00Z",
  },
  {
    id: 3,
    name: "Amit Patel",
    employee_id: "EMP-003",
    email: "amit@electrocom.in",
    phone: "+91 98765 43230",
    department: "Technical",
    role: "Field Technician",
    joining_date: "2019-06-10",
    status: "Active",
    salary: 28000,
    address: "Pune, Maharashtra",
    created_at: "2019-06-10T00:00:00Z",
  },
  {
    id: 4,
    name: "Suresh Reddy",
    employee_id: "EMP-004",
    email: "suresh@electrocom.in",
    phone: "+91 98765 43240",
    department: "Sales",
    role: "Sales Executive",
    joining_date: "2022-01-05",
    status: "On Leave",
    salary: 32000,
    address: "Bangalore, Karnataka",
    created_at: "2022-01-05T00:00:00Z",
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const departments = ["all", ...Array.from(new Set(employees.map(e => e.department)))];
  
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = searchQuery === "" ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Terminated":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <DashboardLayout title="Employees" breadcrumbs={["Home", "People", "Employees"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Employee Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage employee records and profiles</p>
          </div>
          <Button onClick={() => {
            setSelectedEmployee(null);
            setShowModal(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Employees</div>
            <div className="text-2xl font-bold mt-1">{employees.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {employees.filter(e => e.status === "Active").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">On Leave</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">
              {employees.filter(e => e.status === "On Leave").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Payroll</div>
            <div className="text-2xl font-bold mt-1 text-sky-600">
              ₹{employees.filter(e => e.status === "Active").reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Department & Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Salary
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {employee.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{employee.department}</div>
                        <div className="text-gray-500 dark:text-gray-400">{employee.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(employee.joining_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ₹{employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
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
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowModal(false)}
          onSave={(emp) => {
            if (selectedEmployee) {
              setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
            } else {
              setEmployees(prev => [emp, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function EmployeeModal({ employee, onClose, onSave }: {
  employee: Employee | null;
  onClose: () => void;
  onSave: (emp: Employee) => void;
}) {
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    employee_id: employee?.employee_id || `EMP-${Date.now().toString().slice(-3)}`,
    email: employee?.email || "",
    phone: employee?.phone || "",
    department: employee?.department || "Technical",
    role: employee?.role || "",
    joining_date: employee?.joining_date || new Date().toISOString().split('T')[0],
    status: employee?.status || "Active",
    salary: employee?.salary?.toString() || "",
    address: employee?.address || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedEmployee: Employee = {
      id: employee?.id || Date.now(),
      ...formData,
      salary: parseInt(formData.salary),
      created_at: employee?.created_at || new Date().toISOString(),
    };
    onSave(savedEmployee);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">
            {employee ? "Edit Employee" : "Add Employee"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
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
              <label className="block text-sm font-medium mb-2">Employee ID</label>
              <Input
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="Technical">Technical</option>
                <option value="Administration">Administration</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Joining Date</label>
              <Input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Salary (₹)</label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {employee ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
