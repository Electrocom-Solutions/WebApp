"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Tender } from "@/types";

interface TenderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tender: Omit<Tender, "id" | "created_at" | "updated_at">) => void;
  tender?: Tender | null;
}

export default function TenderFormModal({
  isOpen,
  onClose,
  tender,
  onSubmit,
}: TenderFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    reference_number: "",
    description: "",
    filed_date: "",
    start_date: "",
    end_date: "",
    estimated_value: "",
    status: "Draft" as Tender["status"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (tender) {
      setFormData({
        name: tender.name,
        reference_number: tender.reference_number,
        description: tender.description,
        filed_date: tender.filed_date || "",
        start_date: tender.start_date,
        end_date: tender.end_date,
        estimated_value: tender.estimated_value.toString(),
        status: tender.status,
      });
    } else {
      setFormData({
        name: "",
        reference_number: "",
        description: "",
        filed_date: "",
        start_date: "",
        end_date: "",
        estimated_value: "",
        status: "Draft",
      });
    }
    setErrors({});
  }, [tender, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tender name is required";
    }

    if (!formData.reference_number.trim()) {
      newErrors.reference_number = "Reference number is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!formData.estimated_value || parseFloat(formData.estimated_value) <= 0) {
      newErrors.estimated_value = "Estimated value must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: formData.name,
      reference_number: formData.reference_number,
      description: formData.description,
      filed_date: formData.filed_date || undefined,
      start_date: formData.start_date,
      end_date: formData.end_date,
      estimated_value: parseFloat(formData.estimated_value),
      status: formData.status,
    });

    onClose();
  };

  // Calculate financials for display
  const estimatedValue = parseFloat(formData.estimated_value) || 0;
  const emdAmount = estimatedValue * 0.05; // 5%
  const sd1Amount = estimatedValue * 0.02; // 2%
  const sd2Amount = estimatedValue * 0.03; // 3%

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Slide-over panel */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-2xl">
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl dark:divide-gray-700 dark:bg-gray-800"
            >
              {/* Header */}
              <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {tender ? "Edit Tender" : "New Tender"}
                    </h2>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tender Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reference Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.reference_number}
                            onChange={(e) =>
                              setFormData({ ...formData, reference_number: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.reference_number && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.reference_number}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dates and Value */}
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Dates and Financial
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filed Date
                          </label>
                          <input
                            type="date"
                            value={formData.filed_date}
                            onChange={(e) =>
                              setFormData({ ...formData, filed_date: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.filed_date && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.filed_date}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.start_date}
                              onChange={(e) =>
                                setFormData({ ...formData, start_date: e.target.value })
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.start_date && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.start_date}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.end_date}
                              onChange={(e) =>
                                setFormData({ ...formData, end_date: e.target.value })
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.end_date && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.end_date}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estimated Value (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.estimated_value}
                            onChange={(e) =>
                              setFormData({ ...formData, estimated_value: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.estimated_value && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.estimated_value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Auto-calculated Financials Preview */}
                    {estimatedValue > 0 && (
                      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-900/20">
                        <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                          Auto-Calculated Financials
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              EMD (5% of Estimated Value):
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ₹{emdAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Security Deposit 1 (2%):
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ₹{sd1Amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Security Deposit 2 (3%):
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ₹{sd2Amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Status</h3>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as Tender["status"] })
                        }
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Filed">Filed</option>
                        <option value="Awarded">Awarded</option>
                        <option value="Lost">Lost</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-shrink-0 justify-end gap-3 px-4 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
                >
                  {tender ? "Update Tender" : "Create Tender"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
