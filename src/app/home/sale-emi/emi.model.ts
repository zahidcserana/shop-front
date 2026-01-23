export interface EmiInstallment {
  id: number;
  sale_id: number;
  customer_id: number;
  installment_no: number;
  due_date: string;
  amount: number;
  paid_amount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  customer?: any;
}

export interface EmiInstallmentSummary {
    amount: number;
    paid_amount: number;
    due_amount: number;
}

export interface Pagination {
    total: number;
    page_no: number;
    limit: number;
    total_pages: number;
}

export interface EmiInstallmentData {
  data: EmiInstallment[],
  summary: EmiInstallmentSummary
  pagination: Pagination
}
