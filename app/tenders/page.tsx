"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Plus,
  Search,
  LayoutList,
  LayoutGrid,
  FileText,
  Calendar,
  IndianRupee,
  AlertCircle,
  Eye,
  Edit,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import { Tender, TenderFinancials } from "@/types";

// Mock data
const mockTenders: Tender[] = [
  {
    id: 1,
    name: "Smart City Infrastructure Project",
    reference_number: "TND/2024/001",
    description: "Development of smart city infrastructure including traffic management and surveillance systems",
    filed_date: "2024-10-15",
    start_date: "2024-11-01",
    end_date: "2025-10-31",
    estimated_value: 10000000,
    status: "Filed",
    created_at: "2024-10-10T10:00:00Z",
    updated_at: "2024-10-15T14:30:00Z",
  },
  {
    id: 2,
    name: "Municipal Office Networking",
    reference_number: "TND/2024/002",
    description: "Complete networking solution for 5 municipal office buildings",
    filed_date: "2024-09-20",
    start_date: "2024-10-01",
    end_date: "2025-03-31",
    estimated_value: 2500000,
    status: "Awarded",
    created_at: "2024-09-15T09:00:00Z",
    updated_at: "2024-10-25T11:00:00Z",
  },
  {
    id: 3,
    name: "State Highway CCTV Installation",
    reference_number: "TND/2024/003",
    description: "Installation of CCTV cameras along 50km state highway stretch",
    filed_date: "2024-08-10",
    start_date: "2024-09-01",
    end_date: "2024-12-31",
    estimated_value: 5000000,
    status: "Lost",
    created_at: "2024-08-05T10:00:00Z",
    updated_at: "2024-09-15T16:00:00Z",
  },
  {
    id: 4,
    name: "Healthcare IT Modernization",
    reference_number: "TND/2024/004",
    description: "IT infrastructure upgrade for district hospitals",
    filed_date: undefined,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    estimated_value: 8000000,
    status: "Draft",
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-11-01T10:00:00Z",
  },
  {
    id: 5,
    name: "Public WiFi Network Deployment",
    reference_number: "TND/2024/005",
    description: "Deployment of public WiFi across 20 city locations",
    filed_date: "2024-07-15",
    start_date: "2024-08-01",
    end_date: "2024-11-30",
    estimated_value: 3000000,
    status: "Closed",
    created_at: "2024-07-10T10:00:00Z",
    updated_at: "2024-11-20T15:00:00Z",
  },
];

const mockFinancials: TenderFinancials[] = mockTenders.map((tender) => ({
  id: tender.id,
  tender_id: tender.id,
  emd_amount: tender.estimated_value * 0.05, // 5%
  emd_refundable: tender.status !== "Awarded",
  sd1_amount: tender.estimated_value * 0.02, // 2%
  sd1_refundable: false,
  sd2_amount: tender.estimated_value * 0.03, // 3%
  sd2_refundable: false,
}));

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Search and filter
  const filteredTenders = useMemo(() => {
    return mockTenders.filter((tender) => {
      const matchesSearch =
        searchQuery === "" ||
        tender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.reference_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || tender.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: mockTenders.length,
      draft: mockTenders.filter((t) => t.status === "Draft").length,
      filed: mockTenders.filter((t) => t.status === "Filed").length,
      awarded: mockTenders.filter((t) => t.status === "Awarded").length,
      lost: mockTenders.filter((t) => t.status === "Lost").length,
      totalValue: mockTenders.reduce((sum, t) => sum + t.estimated_value, 0),
      awardedValue: mockTenders
        .filter((t) => t.status === "Awarded")
        .reduce((sum, t) => sum + t.estimated_value, 0),
    };
  }, []);

  const getStatusBadgeClass = (status: Tender["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Filed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Awarded":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Lost":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getFinancials = (tenderId: number) => {
    return mockFinancials.find((f) => f.tender_id === tenderId);
  };

  // Group tenders by status for Kanban view
  const kanbanColumns = useMemo(() => {
    const columns: Record<Tender["status"], Tender[]> = {
      Draft: [],
      Filed: [],
      Awarded: [],
      Lost: [],
      Closed: [],
    };

    filteredTenders.forEach((tender) => {
      columns[tender.status].push(tender);
    });

    return columns;
  }, [filteredTenders]);

  return (
    <DashboardLayout
      title="Tenders"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tenders", href: "/tenders" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenders</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage tender pipeline, EMD, security deposits, and documents
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            <Plus className="h-4 w-4" />
            New Tender
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tenders</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="rounded-full bg-sky-100 p-3 dark:bg-sky-900/30">
                <FileText className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filed</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.filed}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Awarded</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.awarded}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  ₹{(stats.awardedValue / 10000000).toFixed(1)}Cr
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{(stats.totalValue / 10000000).toFixed(1)}Cr
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <IndianRupee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Filed">Filed</option>
              <option value="Awarded">Awarded</option>
              <option value="Lost">Lost</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <LayoutList className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-white text-gray-900 shadow dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </button>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && filteredTenders.length > 0 && (
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Filed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Estimated Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      EMD
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {filteredTenders.map((tender) => {
                    const financials = getFinancials(tender.id);
                    return (
                      <tr key={tender.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tender.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {tender.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {tender.reference_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {tender.filed_date
                            ? new Date(tender.filed_date).toLocaleDateString("en-IN")
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tender.start_date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tender.end_date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{(tender.estimated_value / 100000).toFixed(2)}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                              tender.status
                            )}`}
                          >
                            {tender.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {financials ? `₹${(financials.emd_amount / 100000).toFixed(2)}L` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/tenders/${tender.id}`}
                              className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                              title="Edit Tender"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                              title="Attach Documents"
                            >
                              <Paperclip className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {(["Draft", "Filed", "Awarded", "Lost", "Closed"] as const).map((status) => (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between rounded-t-lg bg-white px-4 py-3 shadow dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{status}</h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {kanbanColumns[status].length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {kanbanColumns[status].map((tender) => {
                    const financials = getFinancials(tender.id);
                    return (
                      <div
                        key={tender.id}
                        className="cursor-move rounded-lg bg-white p-4 shadow hover:shadow-md dark:bg-gray-800"
                      >
                        <Link href={`/tenders/${tender.id}`}>
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                            {tender.name}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {tender.reference_number}
                          </p>
                        </Link>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <IndianRupee className="h-3 w-3" />
                            <span>₹{(tender.estimated_value / 100000).toFixed(2)}L</span>
                          </div>
                          {tender.filed_date && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>Filed: {new Date(tender.filed_date).toLocaleDateString("en-IN")}</span>
                            </div>
                          )}
                          {financials && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <AlertCircle className="h-3 w-3" />
                              <span>EMD: ₹{(financials.emd_amount / 100000).toFixed(2)}L</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            className="flex-1 rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            className="flex-1 rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                            title="Edit"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {kanbanColumns[status].length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tenders</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTenders.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No tenders found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first tender
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
              <Plus className="h-4 w-4" />
              New Tender
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
