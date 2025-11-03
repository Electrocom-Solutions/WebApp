"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X, Building2, CreditCard } from "lucide-react";
import { showDeleteConfirm } from "@/lib/sweetalert";

type BankAccount = {
  id: number;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  ifsc_code: string;
  branch: string;
  account_type: "Savings" | "Current";
  is_primary: boolean;
  created_at: string;
};

const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    bank_name: "HDFC Bank",
    account_number: "50100123456789",
    account_holder_name: "Electrocom Pvt. Ltd.",
    ifsc_code: "HDFC0001234",
    branch: "Andheri West, Mumbai",
    account_type: "Current",
    is_primary: true,
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    bank_name: "ICICI Bank",
    account_number: "602305987654",
    account_holder_name: "Electrocom Pvt. Ltd.",
    ifsc_code: "ICIC0006023",
    branch: "Vashi, Navi Mumbai",
    account_type: "Current",
    is_primary: false,
    created_at: "2024-06-20T00:00:00Z",
  },
];

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const handleDelete = async (id: number) => {
    const confirmed = await showDeleteConfirm("this bank account");
    if (confirmed) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <DashboardLayout title="Bank Accounts" breadcrumbs={["Home", "Settings", "Bank Accounts"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bank Account Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Company bank accounts for payments</p>
          </div>
          <Button onClick={() => {
            setSelectedAccount(null);
            setShowModal(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white dark:bg-gray-900 rounded-lg border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{account.bank_name}</h3>
                      {account.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                      <Badge variant="secondary">{account.account_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {account.account_holder_name}
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Account: {account.account_number}</span>
                      </div>
                      <p>IFSC: {account.ifsc_code}</p>
                      <p>Branch: {account.branch}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium">No bank accounts</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first bank account
            </p>
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        )}
      </div>

      {showModal && (
        <BankAccountModal
          account={selectedAccount}
          onClose={() => setShowModal(false)}
          onSave={(acc) => {
            if (selectedAccount) {
              setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
            } else {
              setAccounts(prev => [acc, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function BankAccountModal({ account, onClose, onSave }: {
  account: BankAccount | null;
  onClose: () => void;
  onSave: (acc: BankAccount) => void;
}) {
  const [formData, setFormData] = useState({
    bank_name: account?.bank_name || "",
    account_number: account?.account_number || "",
    account_holder_name: account?.account_holder_name || "",
    ifsc_code: account?.ifsc_code || "",
    branch: account?.branch || "",
    account_type: account?.account_type || "Current",
    is_primary: account?.is_primary || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedAccount: BankAccount = {
      id: account?.id || Date.now(),
      ...formData,
      created_at: account?.created_at || new Date().toISOString(),
    };
    onSave(savedAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">
            {account ? "Edit Bank Account" : "Add Bank Account"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.ifsc_code}
                onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Branch</label>
            <Input
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <select
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-sky-500"
            />
            <label htmlFor="is_primary" className="text-sm font-medium">
              Set as primary account
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {account ? "Update" : "Add"} Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
