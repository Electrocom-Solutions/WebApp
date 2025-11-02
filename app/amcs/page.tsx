'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AMC, AMCBilling, Client } from '@/types';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Mail,
  FileText,
  AlertCircle,
  Calendar,
  IndianRupee,
  Filter,
  Clock,
} from 'lucide-react';
import { format, differenceInDays, addDays, addMonths, addYears } from 'date-fns';
import Link from 'next/link';

const mockClients: Client[] = [
  {
    id: 1,
    name: 'ABC Power Solutions Ltd',
    business_name: 'ABC Power',
    address: '123 Industrial Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin_code: '400001',
    country: 'India',
    primary_contact_name: 'Rajesh Kumar',
    primary_contact_email: 'rajesh@abcpower.com',
    primary_contact_phone: '9876543210',
    tags: ['premium', 'long-term'],
    amc_count: 5,
    open_projects: 3,
    outstanding_amount: 125000,
    last_activity: '2025-10-30T10:00:00Z',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2025-10-30T10:00:00Z',
  },
  {
    id: 2,
    name: 'XYZ Industries',
    business_name: 'XYZ Industries',
    address: '456 Business Park',
    city: 'Pune',
    state: 'Maharashtra',
    pin_code: '411001',
    country: 'India',
    primary_contact_name: 'Priya Sharma',
    primary_contact_email: 'priya@xyzind.com',
    primary_contact_phone: '9765432109',
    tags: ['industrial', 'regular'],
    amc_count: 3,
    open_projects: 2,
    outstanding_amount: 75000,
    last_activity: '2025-10-28T14:00:00Z',
    created_at: '2023-06-20T09:00:00Z',
    updated_at: '2025-10-28T14:00:00Z',
  },
];

const mockAMCs: AMC[] = [
  {
    id: 1,
    client_id: 1,
    client_name: 'ABC Power Solutions Ltd',
    amc_number: 'AMC/2024/028',
    start_date: '2025-01-01',
    end_date: '2025-11-15',
    status: 'Active',
    billing_cycle: 'Quarterly',
    amount: 500000,
    description: 'Annual maintenance for electrical panels and systems',
    notes: 'Client requires 24/7 support',
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2025-01-01T08:00:00Z',
  },
  {
    id: 2,
    client_id: 2,
    client_name: 'XYZ Industries',
    amc_number: 'AMC/2024/033',
    start_date: '2024-06-01',
    end_date: '2025-11-20',
    status: 'Active',
    billing_cycle: 'Monthly',
    amount: 300000,
    description: 'Preventive maintenance for industrial electrical equipment',
    notes: 'Monthly site visits required',
    created_at: '2024-05-20T09:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 3,
    client_id: 1,
    client_name: 'ABC Power Solutions Ltd',
    amc_number: 'AMC/2024/015',
    start_date: '2024-03-01',
    end_date: '2025-02-28',
    status: 'Expired',
    billing_cycle: 'Half-yearly',
    amount: 450000,
    description: 'Panel board maintenance contract',
    created_at: '2024-02-15T11:00:00Z',
    updated_at: '2025-03-01T09:00:00Z',
  },
  {
    id: 4,
    client_id: 1,
    client_name: 'ABC Power Solutions Ltd',
    amc_number: 'AMC/2025/045',
    start_date: '2025-11-01',
    end_date: '2025-11-09',
    status: 'Active',
    billing_cycle: 'Yearly',
    amount: 600000,
    description: 'Comprehensive electrical maintenance',
    notes: 'Expiring soon - need to discuss renewal',
    created_at: '2025-10-20T14:00:00Z',
    updated_at: '2025-11-01T08:00:00Z',
  },
];

const mockBillings: AMCBilling[] = [
  {
    id: 1,
    amc_id: 1,
    bill_number: 'BILL/AMC/2025/001',
    period_from: '2025-01-01',
    period_to: '2025-03-31',
    amount: 125000,
    paid: true,
    payment_date: '2025-01-15',
    payment_mode: 'Bank Transfer',
  },
  {
    id: 2,
    amc_id: 1,
    bill_number: 'BILL/AMC/2025/002',
    period_from: '2025-04-01',
    period_to: '2025-06-30',
    amount: 125000,
    paid: true,
    payment_date: '2025-04-10',
    payment_mode: 'Cheque',
  },
  {
    id: 3,
    amc_id: 1,
    bill_number: 'BILL/AMC/2025/003',
    period_from: '2025-07-01',
    period_to: '2025-09-30',
    amount: 125000,
    paid: false,
  },
  {
    id: 4,
    amc_id: 2,
    bill_number: 'BILL/AMC/2025/010',
    period_from: '2025-10-01',
    period_to: '2025-10-31',
    amount: 25000,
    paid: false,
  },
];

export default function AMCsPage() {
  const [amcs, setAmcs] = useState<AMC[]>(mockAMCs);
  const [billings, setBillings] = useState<AMCBilling[]>(mockBillings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState<number | null>(null);

  const getAMCStats = (amc: AMC) => {
    const amcBills = billings.filter((b) => b.amc_id === amc.id);
    const totalBills = amcBills.length;
    const paidBills = amcBills.filter((b) => b.paid).length;
    const outstanding = amcBills
      .filter((b) => !b.paid)
      .reduce((sum, b) => sum + b.amount, 0);

    const nextBill = amcBills.find((b) => !b.paid);
    const daysToEnd = differenceInDays(new Date(amc.end_date), new Date());

    return { totalBills, paidBills, outstanding, nextBill, daysToEnd };
  };

  const filteredAMCs = amcs.filter((amc) => {
    const matchesSearch =
      searchQuery === '' ||
      amc.amc_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amc.client_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || amc.status === statusFilter;

    const matchesBillingCycle =
      billingCycleFilter === 'all' || amc.billing_cycle === billingCycleFilter;

    const matchesExpiry =
      expiryFilter === null ||
      differenceInDays(new Date(amc.end_date), new Date()) <= expiryFilter;

    return matchesSearch && matchesStatus && matchesBillingCycle && matchesExpiry;
  });

  const expiringAMCs = amcs.filter(
    (amc) =>
      amc.status === 'Active' && differenceInDays(new Date(amc.end_date), new Date()) <= 30
  );

  const pendingBills = billings.filter((b) => !b.paid);

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };
    return classes[status as keyof typeof classes] || classes.Pending;
  };

  const getExpiryBadgeClass = (days: number) => {
    if (days <= 7) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (days <= 15) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    if (days <= 30) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  };

  return (
    <DashboardLayout title="AMCs" breadcrumbs={['Home', 'AMCs']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AMCs</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage Annual Maintenance Contracts and billing
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            <Plus className="h-4 w-4" />
            New AMC
          </button>
        </div>

        {/* Alert Banner */}
        {expiringAMCs.length > 0 && expiryFilter === null && (
          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-900/20">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-900 dark:text-orange-300">
                {expiringAMCs.length} AMC{expiringAMCs.length > 1 ? 's' : ''} expiring in next 30
                days
              </h3>
              <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                Review and plan renewals to avoid service interruptions
              </p>
            </div>
            <button
              onClick={() => setExpiryFilter(30)}
              className="text-sm font-medium text-orange-700 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
            >
              View
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total AMCs</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {amcs.length}
                </p>
              </div>
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                <FileText className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active AMCs
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {amcs.filter((a) => a.status === 'Active').length}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Expiring Soon
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {expiringAMCs.length}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Bills
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {pendingBills.length}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                <IndianRupee className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by AMC Number or Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <select
            value={billingCycleFilter}
            onChange={(e) => setBillingCycleFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Cycles</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-yearly">Half-yearly</option>
            <option value="Yearly">Yearly</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setExpiryFilter(expiryFilter === 7 ? null : 7)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                expiryFilter === 7
                  ? 'bg-sky-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              7 days
            </button>
            <button
              onClick={() => setExpiryFilter(expiryFilter === 15 ? null : 15)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                expiryFilter === 15
                  ? 'bg-sky-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              15 days
            </button>
            <button
              onClick={() => setExpiryFilter(expiryFilter === 30 ? null : 30)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                expiryFilter === 30
                  ? 'bg-sky-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              30 days
            </button>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            <FileText className="h-4 w-4" />
            Generate Missing Bills
          </button>
        </div>

        {/* AMC Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    AMC Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Billing Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Next Bill Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAMCs.map((amc) => {
                  const stats = getAMCStats(amc);
                  return (
                    <tr
                      key={amc.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/amcs/${amc.id}`}
                          className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          {amc.amc_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {amc.client_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          {format(new Date(amc.start_date), 'dd MMM yyyy')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(amc.end_date), 'dd MMM yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {amc.billing_cycle}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{amc.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                            amc.status
                          )}`}
                        >
                          {amc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stats.nextBill ? (
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {format(new Date(stats.nextBill.period_to), 'dd MMM')}
                            </div>
                          </div>
                        ) : stats.daysToEnd > 0 ? (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getExpiryBadgeClass(
                              stats.daysToEnd
                            )}`}
                          >
                            {stats.daysToEnd} days left
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stats.outstanding > 0 ? (
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            ₹{stats.outstanding.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/amcs/${amc.id}`}
                            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            title="Edit AMC"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            title="Send Reminder"
                          >
                            <Mail className="h-4 w-4" />
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

        {filteredAMCs.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No AMCs found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first AMC contract
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
              <Plus className="h-4 w-4" />
              New AMC
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
