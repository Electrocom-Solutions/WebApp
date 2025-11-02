export type Client = {
  id: number;
  name: string;
  business_name?: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  secondary_contact?: string;
  notes?: string;
  tags: string[];
  amc_count: number;
  open_projects: number;
  outstanding_amount: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
};

export type ClientActivity = {
  id: number;
  client_id: number;
  type: "Task Created" | "Bill Generated" | "Email Sent" | "Project Started" | "AMC Created" | "Payment Received";
  description: string;
  performed_by: string;
  timestamp: string;
};

export type AMC = {
  id: number;
  client_id: number;
  client_name?: string;
  amc_number: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Active" | "Expired" | "Canceled";
  billing_cycle: "Monthly" | "Quarterly" | "Half-yearly" | "Yearly";
  amount: number;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type AMCBilling = {
  id: number;
  amc_id: number;
  bill_number: string;
  bill_date?: string;
  period_from: string;
  period_to: string;
  amount: number;
  paid: boolean;
  payment_date?: string;
  payment_mode?: "Cash" | "Cheque" | "Bank Transfer" | "UPI";
  notes?: string;
};

export type AMCActivity = {
  id: number;
  amc_id: number;
  type: "Bill Generated" | "Payment Received" | "Reminder Sent" | "AMC Renewed" | "AMC Canceled" | "Bill Canceled";
  description: string;
  performed_by: string;
  timestamp: string;
};

export type Tender = {
  id: number;
  name: string;
  reference_number: string;
  description: string;
  filed_date?: string;
  start_date: string;
  end_date: string;
  estimated_value: number;
  status: "Draft" | "Filed" | "Awarded" | "Lost" | "Closed";
  created_at: string;
  updated_at: string;
};

export type TenderFinancials = {
  id: number;
  tender_id: number;
  emd_amount: number; // 5% of estimated value
  emd_dd_number?: string;
  emd_dd_date?: string;
  emd_bank?: string;
  emd_refundable: boolean;
  emd_refund_date?: string;
  sd1_amount: number; // 2% of estimated value
  sd1_dd_number?: string;
  sd1_dd_date?: string;
  sd1_bank?: string;
  sd1_refundable: boolean;
  sd1_refund_date?: string;
  sd2_amount: number; // 3% of estimated value
  sd2_dd_number?: string;
  sd2_dd_date?: string;
  sd2_bank?: string;
  sd2_refundable: boolean;
  sd2_refund_date?: string;
  notes?: string;
};

export type TenderDocument = {
  id: number;
  tender_id: number;
  document_id: number; // Links to DocumentTemplate
  document_title?: string;
  attached_at: string;
  attached_by: string;
};

export type TenderActivity = {
  id: number;
  tender_id: number;
  type: "Status Changed" | "Document Attached" | "Reminder Sent" | "Financial Updated" | "Note Added" | "Refund Marked";
  description: string;
  performed_by: string;
  timestamp: string;
};

export type Employee = {
  id: number;
  profile_id: number;
  employee_code: string;
  designation: "Technician" | "Field Staff" | "Computer Operator" | "Other";
  department: string;
  joining_date: string;
  created_at: string;
  updated_at: string;
};

export type ContractWorker = {
  id: number;
  profile_id: number;
  project_id: number;
  name: string;
  worker_type: "Unskilled" | "Semi-Skilled" | "Skilled";
  monthly_salary: number;
  aadhar_no: string;
  uan_number?: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  client_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "Planned" | "In Progress" | "On Hold" | "Completed" | "Canceled";
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: number;
  employee_id: number;
  project_id: number;
  description: string;
  date: string;
  location: string;
  time_taken_minutes: number;
  cost_incurred: number;
  status: "Open" | "In Progress" | "Completed" | "Canceled";
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: number;
  recipient_id: number;
  title: string;
  message: string;
  type: "Task" | "AMC" | "Tender" | "Payroll" | "System" | "Other";
  channel: "In-App" | "Email" | "Push";
  is_read: boolean;
  created_at: string;
};

export type DocumentTemplate = {
  id: number;
  title: string;
  category: "AMC" | "Tender" | "Invoice" | "Contract" | "Report" | "Other";
  tags: string[];
  latest_version_number: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type DocumentVersion = {
  id: number;
  template_id: number;
  version_number: number;
  file_name: string;
  file_type: "pdf" | "docx";
  file_size: number;
  file_url: string;
  is_published: boolean;
  uploaded_by: string;
  uploaded_at: string;
  notes?: string;
};
