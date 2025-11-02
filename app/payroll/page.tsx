"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  IndianRupee,
  Users,
  HardHat,
  Download,
  FileText,
  Check,
  Eye,
  Calculator,
  Filter,
  Search,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mockPayrollRecords } from "@/lib/mock-data/payroll";
import { PayrollRecord, PaymentStatus, PaymentMode } from "@/types";
import { format } from "date-fns";
import { PayslipModal } from "@/components/payroll/payslip-modal";
import { MarkPaidModal } from "@/components/payroll/mark-paid-modal";

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [periodStart, setPeriodStart] = useState("2025-10-01");
  const [periodEnd, setPeriodEnd] = useState("2025-10-31");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const recordStart = new Date(record.period_start);
      const filterStart = new Date(periodStart);
      const filterEnd = new Date(periodEnd);
      
      const inPeriod = recordStart >= filterStart && recordStart <= filterEnd;
      const matchesStatus = statusFilter === "all" || record.payment_status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        record.employee_name.toLowerCase().includes(searchQuery.toLowerCase());

      return inPeriod && matchesStatus && matchesSearch;
    });
  }, [payrollRecords, periodStart, periodEnd, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const employeeRecords = filteredRecords.filter((r) => r.employee_type === "Employee");
    const contractRecords = filteredRecords.filter((r) => r.employee_type === "Contract Worker");
    
    return {
      totalPayrollCost: filteredRecords.reduce((sum, r) => sum + (r.computation_details?.net_amount || 0), 0),
      employeeCount: employeeRecords.length,
      employeeCost: employeeRecords.reduce((sum, r) => sum + (r.computation_details?.net_amount || 0), 0),
      contractCount: contractRecords.length,
      contractCost: contractRecords.reduce((sum, r) => sum + (r.computation_details?.net_amount || 0), 0),
      pendingCount: filteredRecords.filter((r) => r.payment_status === "Pending").length,
      paidCount: filteredRecords.filter((r) => r.payment_status === "Paid").length,
    };
  }, [filteredRecords]);

  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedPayroll(record);
    setShowPayslipModal(true);
  };

  const handleMarkPaid = (record: PayrollRecord) => {
    setSelectedPayroll(record);
    setShowMarkPaidModal(true);
  };

  const handleMarkPaidSubmit = (paymentMode: PaymentMode, bankRef: string, paymentDate: string) => {
    if (!selectedPayroll) return;

    setPayrollRecords((prev) =>
      prev.map((record) =>
        record.id === selectedPayroll.id
          ? {
              ...record,
              payment_status: "Paid" as PaymentStatus,
              payment_mode: paymentMode,
              bank_transaction_ref: bankRef,
              payment_date: paymentDate,
            }
          : record
      )
    );
  };

  const handleRecalculate = (recordId: number) => {
    console.log("Recalculate payroll:", recordId);
  };

  const handleToggleSelect = (recordId: number) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map((r) => r.id));
    }
  };

  const handleBulkGeneratePayslips = () => {
    console.log("Generate payslips for:", selectedRecords);
  };

  const handleBulkMarkPaid = () => {
    console.log("Mark paid for:", selectedRecords);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Hold": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <DashboardLayout title="Payroll" breadcrumbs={["Home", "Payroll"]}>
      <div className="space-y-6">
        {/* Period Selector & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="period-start" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                From:
              </label>
              <input
                id="period-start"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="period-end" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                To:
              </label>
              <input
                id="period-end"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBulkGeneratePayslips}
              disabled={selectedRecords.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FileText className="h-4 w-4" />
              Generate Payslips ({selectedRecords.length})
            </button>
            <button
              onClick={handleBulkMarkPaid}
              disabled={selectedRecords.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Mark Paid ({selectedRecords.length})
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payroll Cost</p>
              <IndianRupee className="h-5 w-5 text-sky-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              ₹{(stats.totalPayrollCost / 100000).toFixed(2)}L
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {stats.pendingCount} pending, {stats.paidCount} paid
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Employees</p>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.employeeCount}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Cost: ₹{(stats.employeeCost / 100000).toFixed(2)}L
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contract Workers</p>
              <HardHat className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.contractCount}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Cost: ₹{(stats.contractCost / 100000).toFixed(2)}L
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Salary</p>
              <IndianRupee className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              ₹{filteredRecords.length > 0 ? Math.round(stats.totalPayrollCost / filteredRecords.length).toLocaleString("en-IN") : 0}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Per person this period</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:w-80"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "all")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Working Days
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Days Present
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Gross
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Deductions
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Net Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Payment Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleToggleSelect(record.id)}
                        className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{record.employee_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(record.period_start), "MMM yyyy")}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {record.employee_type}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-white">
                      {record.working_days}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{record.days_present}</span>
                      {record.days_absent > 0 && (
                        <span className="ml-1 text-xs text-red-600 dark:text-red-400">(-{record.days_absent})</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                      ₹{record.computation_details?.gross_amount?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-red-600 dark:text-red-400">
                      ₹{record.computation_details?.total_deductions?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                      ₹{record.computation_details?.net_amount?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(record.payment_status)}`}>
                        {record.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewPayslip(record)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                          title="View Payslip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {record.payment_status === "Pending" && (
                          <button
                            onClick={() => handleMarkPaid(record)}
                            className="rounded p-1 text-green-600 hover:bg-green-50 hover:text-green-900 dark:text-green-400 dark:hover:bg-green-900/30"
                            title="Mark Paid"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRecalculate(record.id)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Recalculate"
                        >
                          <Calculator className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payroll records found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No records for the selected period and filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayroll && (
        <PayslipModal
          payroll={selectedPayroll}
          isOpen={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
        />
      )}

      {/* Mark Paid Modal */}
      {selectedPayroll && (
        <MarkPaidModal
          payroll={selectedPayroll}
          isOpen={showMarkPaidModal}
          onClose={() => setShowMarkPaidModal(false)}
          onSubmit={handleMarkPaidSubmit}
        />
      )}
    </DashboardLayout>
  );
}
