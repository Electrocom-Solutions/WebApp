"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, Calendar, Bell, Plus, Edit, Trash2, X } from "lucide-react";
import { BankAccount, Holiday, SystemSettings } from "@/types";
import { mockBankAccounts, mockHolidays, mockSystemSettings } from "@/lib/mock-data/settings";
import { showSuccess, showDeleteConfirm } from "@/lib/sweetalert";

type Tab = "company" | "bank-accounts" | "holidays" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const tabs = [
    { id: "company" as Tab, label: "Company", icon: Building2 },
    { id: "bank-accounts" as Tab, label: "Bank Accounts", icon: CreditCard },
    { id: "holidays" as Tab, label: "Holiday Calendar", icon: Calendar },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
  ];

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await showSuccess("Settings Saved", "Company settings saved successfully!");
  };

  const handleDeleteBank = async (id: number) => {
    const confirmed = await showDeleteConfirm("this bank account");
    if (confirmed) {
      setBankAccounts(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    const confirmed = await showDeleteConfirm("this holiday");
    if (confirmed) {
      setHolidays(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <DashboardLayout title="Settings" breadcrumbs={["Home", "Settings"]}>
      <div className="space-y-6">
        <div className="border-b dark:border-gray-800">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-sky-500 text-sky-600 dark:text-sky-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === "company" && (
          <form onSubmit={handleSaveCompany} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input
                      value={settings.company_name}
                      onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={settings.company_email}
                      onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={settings.company_phone}
                      onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <Input
                      value={settings.company_website}
                      onChange={(e) => setSettings({ ...settings, company_website: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GST Number</label>
                    <Input
                      value={settings.gst_number}
                      onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PAN Number</label>
                    <Input
                      value={settings.pan_number}
                      onChange={(e) => setSettings({ ...settings, pan_number: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    value={settings.company_address}
                    onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </CardContent>
            </Card>
          </form>
        )}

        {activeTab === "bank-accounts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bank Accounts</h3>
              <Button onClick={() => {
                setSelectedBank(null);
                setShowBankModal(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Account
              </Button>
            </div>
            <div className="grid gap-4">
              {bankAccounts.map((bank) => (
                <Card key={bank.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{bank.bank_name}</h4>
                          {bank.is_primary && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {bank.account_holder_name}
                        </p>
                        <div className="text-sm text-gray-500 mt-2">
                          <p>Account: {bank.account_number}</p>
                          <p>IFSC: {bank.ifsc_code} | Branch: {bank.branch}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBank(bank);
                            setShowBankModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBank(bank.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "holidays" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Holiday Calendar</h3>
              <Button onClick={() => {
                setSelectedHoliday(null);
                setShowHolidayModal(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Holiday Name</th>
                      <th className="text-left p-3 text-sm font-medium">Type</th>
                      <th className="text-right p-3 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {holidays.map((holiday) => (
                      <tr key={holiday.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3">
                          {new Date(holiday.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-medium">{holiday.name}</td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                            {holiday.type}
                            {holiday.is_optional && " (Optional)"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHoliday(holiday.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.email_notifications_enabled}
                  onChange={(e) => setSettings({ ...settings, email_notifications_enabled: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sms_notifications_enabled}
                  onChange={(e) => setSettings({ ...settings, sms_notifications_enabled: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reminder Days Before</label>
                <Input
                  type="number"
                  value={settings.reminder_days_before}
                  onChange={(e) => setSettings({ ...settings, reminder_days_before: parseInt(e.target.value) })}
                  min="1"
                  max="30"
                />
              </div>
              <Button onClick={() => showSuccess("Preferences Saved", "Notification settings saved successfully!")}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showBankModal && (
        <BankModal
          bank={selectedBank}
          onClose={() => setShowBankModal(false)}
          onSave={(bank) => {
            if (selectedBank) {
              setBankAccounts(prev => prev.map(b => b.id === bank.id ? bank : b));
            } else {
              setBankAccounts(prev => [bank, ...prev]);
            }
            setShowBankModal(false);
          }}
        />
      )}

      {showHolidayModal && (
        <HolidayModal
          onClose={() => setShowHolidayModal(false)}
          onSave={(holiday) => {
            setHolidays(prev => [holiday, ...prev]);
            setShowHolidayModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function BankModal({
  bank,
  onClose,
  onSave,
}: {
  bank: BankAccount | null;
  onClose: () => void;
  onSave: (bank: BankAccount) => void;
}) {
  const [formData, setFormData] = useState({
    bank_name: bank?.bank_name || "",
    account_number: bank?.account_number || "",
    ifsc_code: bank?.ifsc_code || "",
    branch: bank?.branch || "",
    account_holder_name: bank?.account_holder_name || "",
    is_primary: bank?.is_primary || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedBank: BankAccount = {
      id: bank?.id || Date.now(),
      ...formData,
      created_at: bank?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(savedBank);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">{bank ? "Edit" : "Add"} Bank Account</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name *</label>
            <Input
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Number *</label>
            <Input
              value={formData.account_number}
              onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">IFSC Code *</label>
            <Input
              value={formData.ifsc_code}
              onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Branch *</label>
            <Input
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Holder Name *</label>
            <Input
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_primary}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="h-4 w-4"
            />
            <label className="text-sm font-medium">Set as Primary Account</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{bank ? "Update" : "Add"} Account</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HolidayModal({ onClose, onSave }: { onClose: () => void; onSave: (holiday: Holiday) => void }) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "National" as "National" | "Regional" | "Company",
    is_optional: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedHoliday: Holiday = {
      id: Date.now(),
      ...formData,
      created_at: new Date().toISOString(),
    };
    onSave(savedHoliday);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">Add Holiday</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Holiday Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Diwali"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="National">National</option>
              <option value="Regional">Regional</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_optional}
              onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
              className="h-4 w-4"
            />
            <label className="text-sm font-medium">Optional Holiday</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Holiday</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
