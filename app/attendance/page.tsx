"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Check, X as XIcon, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

type AttendanceRecord = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  status: "Present" | "Absent" | "Leave" | "Half Day";
  check_in?: string;
  check_out?: string;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
};

const mockAttendance: AttendanceRecord[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: "Rajesh Kumar",
    date: "2025-11-01",
    status: "Present",
    check_in: "09:15",
    check_out: "18:30",
    approved_by: "Admin",
    approved_at: "2025-11-01T18:30:00Z",
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: "Priya Sharma",
    date: "2025-11-01",
    status: "Present",
    check_in: "09:00",
    check_out: "18:00",
    approved_by: "Admin",
    approved_at: "2025-11-01T18:00:00Z",
  },
  {
    id: 3,
    employee_id: 1,
    employee_name: "Rajesh Kumar",
    date: "2025-11-02",
    status: "Present",
    check_in: "09:10",
    approved_by: "Admin",
    approved_at: "2025-11-02T09:10:00Z",
  },
  {
    id: 4,
    employee_id: 3,
    employee_name: "Amit Patel",
    date: "2025-11-01",
    status: "Leave",
    notes: "Medical leave",
  },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [showMarkModal, setShowMarkModal] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    return isSameMonth(recordDate, currentMonth) &&
      (searchQuery === "" || record.employee_name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Absent":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Leave":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Half Day":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const stats = {
    totalDays: monthDays.length,
    present: filteredAttendance.filter(r => r.status === "Present").length,
    absent: filteredAttendance.filter(r => r.status === "Absent").length,
    leave: filteredAttendance.filter(r => r.status === "Leave").length,
  };

  const handleExportReport = () => {
    const csvContent = [
      ["Date", "Employee", "Status", "Check In", "Check Out", "Notes", "Approved By"].join(","),
      ...filteredAttendance.map(record => [
        record.date,
        record.employee_name,
        record.status,
        record.check_in || "",
        record.check_out || "",
        record.notes || "",
        record.approved_by || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${format(currentMonth, "yyyy-MM")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Attendance" breadcrumbs={["Home", "People", "Attendance"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Attendance Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Track daily attendance and approvals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setShowMarkModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Working Days</div>
            <div className="text-2xl font-bold mt-1">{stats.totalDays}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Present</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{stats.present}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Absent</div>
            <div className="text-2xl font-bold mt-1 text-red-600">{stats.absent}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">On Leave</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">{stats.leave}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Approved
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm font-medium">
                      {format(new Date(record.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm">{record.employee_name}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.check_in || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.check_out || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.notes || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {record.approved_by ? (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          {record.approved_by}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              {monthDays.map((day, idx) => {
                const dayAttendance = attendance.filter(r => isSameDay(new Date(r.date), day));
                const presentCount = dayAttendance.filter(r => r.status === "Present").length;
                const absentCount = dayAttendance.filter(r => r.status === "Absent").length;

                return (
                  <div
                    key={idx}
                    className="border dark:border-gray-800 rounded-lg p-2 min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                    {dayAttendance.length > 0 && (
                      <div className="space-y-1 text-xs">
                        {presentCount > 0 && (
                          <div className="text-green-600">✓ {presentCount}</div>
                        )}
                        {absentCount > 0 && (
                          <div className="text-red-600">✗ {absentCount}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showMarkModal && (
        <MarkAttendanceModal
          onClose={() => setShowMarkModal(false)}
          onSave={(record) => {
            setAttendance(prev => [record, ...prev]);
            setShowMarkModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function MarkAttendanceModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
}) {
  const [formData, setFormData] = useState({
    employee_name: "",
    date: new Date().toISOString().split('T')[0],
    status: "Present" as AttendanceRecord["status"],
    check_in: "",
    check_out: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employee_id: Math.floor(Math.random() * 100),
      employee_name: formData.employee_name,
      date: formData.date,
      status: formData.status,
      check_in: formData.check_in || undefined,
      check_out: formData.check_out || undefined,
      notes: formData.notes || undefined,
      approved_by: "Admin",
      approved_at: new Date().toISOString(),
    };
    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
          <button onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.employee_name}
              onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
              placeholder="Enter employee name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Check In</label>
              <Input
                type="time"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check Out</label>
              <Input
                type="time"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Optional notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Attendance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
