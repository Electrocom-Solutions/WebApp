import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BankAccountsPage() {
  return (
    <DashboardLayout title="Bank Accounts" breadcrumbs={["Home", "Bank Accounts"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bank Account Management</h2>
            <p className="text-gray-500">Company bank accounts for payments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">Bank account management will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
