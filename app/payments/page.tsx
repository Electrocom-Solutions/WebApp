"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, X, AlertCircle, CheckCircle, Clock, Ban } from "lucide-react";
import { Payment, PaymentStatus, PaymentMode, PaymentCategory } from "@/types";
import { cn } from "@/lib/utils";
import { showDeleteConfirm, showAlert, showSuccess } from "@/lib/sweetalert";
import { format, isAfter, isBefore } from "date-fns";

const mockPayments: Payment[] = [
  {
    id: 1,
    payment_number: "PAY-2025-001",
    vendor_name: "ABC Electric Supplies",
    category: "Vendor",
    amount: 45000,
    description: "Electrical components for BSNL project",
    due_date: "2025-11-05T00:00:00Z",
    status: "Pending",
    created_by: "Admin",
    created_at: "2025-10-25T00:00:00Z",
    updated_at: "2025-10-25T00:00:00Z",
  },
  {
    id: 2,
    payment_number: "PAY-2025-002",
    contractor_id: 1,
    contractor_name: "Ramesh Kumar",
    category: "Contractor",
    amount: 28000,
    description: "Contract work payment - October",
    due_date: "2025-11-01T00:00:00Z",
    paid_date: "2025-10-31T00:00:00Z",
    status: "Overdue",
    payment_mode: "Bank Transfer",
    transaction_reference: "TXN123456789",
    created_by: "Admin",
    created_at: "2025-10-20T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: 3,
    payment_number: "PAY-2025-003",
    vendor_name: "Metro Utilities",
    category: "Utility",
    amount: 12500,
    description: "Office electricity bill - October",
    due_date: "2025-11-10T00:00:00Z",
    paid_date: "2025-11-02T00:00:00Z",
    status: "Paid",
    payment_mode: "UPI",
    transaction_reference: "UPI/98765432",
    created_by: "Admin",
    created_at: "2025-11-01T00:00:00Z",
    updated_at: "2025-11-02T00:00:00Z",
  },
  {
    id: 4,
    payment_number: "PAY-2025-004",
    contractor_id: 2,
    contractor_name: "Sunil Verma",
    category: "Contractor",
    amount: 32000,
    description: "Site maintenance work",
    due_date: "2025-10-28T00:00:00Z",
    status: "Overdue",
    notes: "Payment delayed due to pending verification",
    created_by: "Admin",
    created_at: "2025-10-18T00:00:00Z",
    updated_at: "2025-10-28T00:00:00Z",
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<PaymentCategory | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.contractor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || payment.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    const confirmed = await showDeleteConfirm("Are you sure you want to delete this payment record?");
    if (confirmed) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleMarkPaid = async (payment: Payment) => {
    if (payment.status === "Paid") {
      await showAlert("Already Paid", "This payment has already been marked as paid", "info");
      return;
    }
    
    setPayments((prev) =>
      prev.map((p) =>
        p.id === payment.id
          ? {
              ...p,
              status: "Paid" as PaymentStatus,
              paid_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : p
      )
    );
    await showSuccess("Payment marked as paid successfully");
  };

  const stats = {
    total: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    pending: filteredPayments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0),
    paid: filteredPayments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0),
    overdue: filteredPayments.filter((p) => p.status === "Overdue").reduce((sum, p) => sum + p.amount, 0),
    overdueCount: filteredPayments.filter((p) => p.status === "Overdue").length,
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "Cancelled":
        return <Ban className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "Hold":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    }
  };

  return (
    <DashboardLayout title="Payment Tracking">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track vendor, contractor, and employee payments
          </p>
        </div>

        {stats.overdueCount > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">
                  {stats.overdueCount} Overdue Payment{stats.overdueCount > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Total overdue amount: ₹{stats.overdue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
            <p className="text-2xl font-bold mt-1">₹{stats.total.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">₹{stats.pending.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
            <p className="text-2xl font-bold mt-1 text-green-600">₹{stats.paid.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            <p className="text-2xl font-bold mt-1 text-red-600">₹{stats.overdue.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by payment number, vendor, contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Hold">Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Vendor">Vendor</option>
            <option value="Contractor">Contractor</option>
            <option value="Employee">Employee</option>
            <option value="Utility">Utility</option>
            <option value="Other">Other</option>
          </select>
          <Button onClick={() => {
            setSelectedPayment(null);
            setShowModal(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mode</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium">{payment.payment_number}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{payment.vendor_name || payment.contractor_name || payment.employee_name}</p>
                      <p className="text-xs text-gray-500">{payment.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{payment.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold">₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(payment.due_date), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full", getStatusColor(payment.status))}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{payment.payment_mode || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {payment.status !== "Paid" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkPaid(payment)}
                          title="Mark as Paid"
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowModal(true);
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(payment.id)}
                        title="Delete"
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
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setShowModal(false)}
          onSave={(payment) => {
            if (selectedPayment) {
              setPayments((prev) => prev.map((p) => (p.id === payment.id ? payment : p)));
            } else {
              setPayments((prev) => [payment, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function PaymentModal({
  payment,
  onClose,
  onSave,
}: {
  payment: Payment | null;
  onClose: () => void;
  onSave: (payment: Payment) => void;
}) {
  const [paymentNumber, setPaymentNumber] = useState(payment?.payment_number || `PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`);
  const [category, setCategory] = useState<PaymentCategory>(payment?.category || "Vendor");
  const [vendorName, setVendorName] = useState(payment?.vendor_name || "");
  const [contractorName, setContractorName] = useState(payment?.contractor_name || "");
  const [amount, setAmount] = useState(payment?.amount || 0);
  const [description, setDescription] = useState(payment?.description || "");
  const [dueDate, setDueDate] = useState(payment?.due_date ? format(new Date(payment.due_date), "yyyy-MM-dd") : "");
  const [status, setStatus] = useState<PaymentStatus>(payment?.status || "Pending");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | "">(payment?.payment_mode || "");
  const [transactionRef, setTransactionRef] = useState(payment?.transaction_reference || "");
  const [notes, setNotes] = useState(payment?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPayment: Payment = {
      id: payment?.id || Date.now(),
      payment_number: paymentNumber,
      vendor_name: category === "Vendor" || category === "Utility" ? vendorName : undefined,
      contractor_name: category === "Contractor" ? contractorName : undefined,
      category,
      amount,
      description,
      due_date: new Date(dueDate).toISOString(),
      paid_date: status === "Paid" ? new Date().toISOString() : undefined,
      status,
      payment_mode: paymentMode || undefined,
      transaction_reference: transactionRef || undefined,
      notes: notes || undefined,
      created_by: "Admin",
      created_at: payment?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(savedPayment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-semibold">
            {payment ? "Edit Payment" : "Create Payment"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                placeholder="PAY-2025-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PaymentCategory)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                required
              >
                <option value="Vendor">Vendor</option>
                <option value="Contractor">Contractor</option>
                <option value="Employee">Employee</option>
                <option value="Utility">Utility</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {(category === "Vendor" || category === "Utility") && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
                required
              />
            </div>
          )}

          {category === "Contractor" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contractor Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                placeholder="Enter contractor name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              placeholder="Payment description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Hold">Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="">Select mode</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="NEFT/RTGS">NEFT/RTGS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction Reference</label>
            <Input
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Transaction ID or reference number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {payment ? "Update" : "Create"} Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
