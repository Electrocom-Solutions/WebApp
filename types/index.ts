export type Client = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type AMC = {
  id: number;
  client_id: number;
  amc_number: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Active" | "Expired" | "Canceled";
  billing_cycle: "Monthly" | "Quarterly" | "Half-yearly" | "Yearly";
  amount: number;
  created_at: string;
  updated_at: string;
};

export type AMCBilling = {
  id: number;
  amc_id: number;
  bill_number: string;
  bill_date: string;
  period_from: string;
  period_to: string;
  amount: number;
  paid: boolean;
  payment_date?: string;
  payment_mode?: "Cash" | "Cheque" | "Bank Transfer" | "UPI";
  notes?: string;
};

export type Tender = {
  id: number;
  name: string;
  reference_number: string;
  description: string;
  filed_date: string;
  start_date: string;
  end_date: string;
  estimated_value: number;
  status: "Filed" | "Awarded" | "Lost" | "Closed";
  created_at: string;
  updated_at: string;
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
