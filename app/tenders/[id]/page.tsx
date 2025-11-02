"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  ArrowLeft,
  Edit,
  FileText,
  IndianRupee,
  Calendar,
  ChevronDown,
  ChevronUp,
  Bell,
  Printer,
  RefreshCw,
  Paperclip,
  Plus,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tender } from "@/types";
import {
  getTenderById,
  getFinancialsByTenderId,
  getDocumentsByTenderId,
  getActivitiesByTenderId,
} from "@/lib/mock-data/tenders";

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = parseInt(params.id as string, 10);

  // Look up tender and related data by ID
  const tender = getTenderById(tenderId);
  const financials = getFinancialsByTenderId(tenderId);
  const documents = getDocumentsByTenderId(tenderId);
  const activities = getActivitiesByTenderId(tenderId);

  // Handle tender not found
  if (!tender) {
    return (
      <DashboardLayout title="Tender Not Found" breadcrumbs={["Home", "Tenders", "Not Found"]}>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Tender Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The tender you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/tenders"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tenders
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const [expandedSections, setExpandedSections] = useState({
    basicDetails: true,
    financials: true,
    documents: true,
    activityFeed: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  return (
    <DashboardLayout
      title={`Tender - ${tender.reference_number}`}
      breadcrumbs={["Home", "Tenders", tender.reference_number]}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/tenders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenders
        </Link>

        {/* Header Card */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tender.name}
                </h1>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
                    tender.status
                  )}`}
                >
                  {tender.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {tender.reference_number}
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{tender.description}</p>

              {/* Key Dates */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {tender.filed_date && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Filed Date
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      {new Date(tender.filed_date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4" />
                    {new Date(tender.start_date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4" />
                    {new Date(tender.end_date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Estimated Value</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              ₹{(tender.estimated_value / 100000).toFixed(2)}L
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">EMD (5%)</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              ₹{((financials?.emd_amount || tender.estimated_value * 0.05) / 100000).toFixed(2)}L
            </p>
            {financials?.emd_refundable && (
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Check className="h-3 w-3" />
                Refundable
              </span>
            )}
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SD1 (2%)</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              ₹{((financials?.sd1_amount || tender.estimated_value * 0.02) / 100000).toFixed(2)}L
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SD2 (3%)</p>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              ₹{((financials?.sd2_amount || tender.estimated_value * 0.03) / 100000).toFixed(2)}L
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            <Bell className="h-4 w-4" />
            Generate EMD Reminder
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Printer className="h-4 w-4" />
            Bulk Print Documents
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <RefreshCw className="h-4 w-4" />
            Mark Refund
          </button>
        </div>

        {/* Basic Details Panel */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <button
            onClick={() => toggleSection("basicDetails")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Details</h2>
            {expandedSections.basicDetails ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          {expandedSections.basicDetails && (
            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tender Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{tender.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reference Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {tender.reference_number}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {tender.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estimated Value
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    ₹{tender.estimated_value.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        tender.status
                      )}`}
                    >
                      {tender.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financials Panel */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <button
            onClick={() => toggleSection("financials")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Financials & Deposits
            </h2>
            {expandedSections.financials ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          {expandedSections.financials && (
            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <div className="space-y-6">
                {/* EMD Section */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Earnest Money Deposit (EMD) - 5%
                    </h3>
                    {financials?.emd_refundable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Refundable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <X className="h-3 w-3" />
                        Non-Refundable
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        ₹{financials?.emd_amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    {financials?.emd_dd_number && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">DD Number</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                          {financials?.emd_dd_number}
                        </p>
                      </div>
                    )}
                    {financials?.emd_dd_date && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">DD Date</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                          {new Date(financials?.emd_dd_date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    )}
                    {financials?.emd_bank && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bank</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                          {financials?.emd_bank}
                        </p>
                      </div>
                    )}
                  </div>
                  {financials?.emd_refund_date && (
                    <div className="mt-3 rounded bg-green-50 p-3 dark:bg-green-900/10">
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Refunded on{" "}
                        {new Date(financials?.emd_refund_date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>

                {/* SD1 Section */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Security Deposit 1 (SD1) - 2%
                    </h3>
                    {financials?.sd1_refundable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Refundable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Pending Submission
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      ₹{financials?.sd1_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* SD2 Section */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Security Deposit 2 (SD2) - 3%
                    </h3>
                    {financials?.sd2_refundable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Refundable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Pending Submission
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      ₹{financials?.sd2_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {financials?.notes && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/30">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {financials?.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Documents Panel */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <button
            onClick={() => toggleSection("documents")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {documents.length}
              </span>
            </div>
            {expandedSections.documents ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          {expandedSections.documents && (
            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4">
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Plus className="h-4 w-4" />
                  Attach Documents
                </button>
              </div>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-sky-100 p-2 dark:bg-sky-900/30">
                        <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {doc.document_title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Attached by {doc.attached_by} on{" "}
                          {new Date(doc.attached_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <button className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <Paperclip className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed Panel */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <button
            onClick={() => toggleSection("activityFeed")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activity Feed
              </h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {activities.length}
              </span>
            </div>
            {expandedSections.activityFeed ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          {expandedSections.activityFeed && (
            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-sky-100 p-2 dark:bg-sky-900/30">
                        <div className="h-2 w-2 rounded-full bg-sky-600 dark:bg-sky-400" />
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {activity.performed_by} •{" "}
                        {new Date(activity.timestamp).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
