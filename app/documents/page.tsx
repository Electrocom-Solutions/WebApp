import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <DashboardLayout title="Documents" breadcrumbs={["Home", "Documents"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Document Management</h2>
            <p className="text-gray-500">Manage templates and document versions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No document templates yet</p>
              <p className="text-sm text-gray-400 mb-4">Upload your first template to get started</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
