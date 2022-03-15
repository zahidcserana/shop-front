export class CartItem {
  medicine: string;
  quantity: number;
  batch_no: string;
  token: string;
  unit_type: string = 'PCS';
}
export class DataModel {
  customer_name: string;
  customer_mobile: string;
  total_payble_amount: number;
  created_at: string;
  invoice: string;
}
export class SaleFilterModel {
  medicine: string;
  medicine_id: number;
  customer_name: string;
  customer_mobile: string;
  total_payble_amount: number;
  created_at: string;
  invoice: string;
  date_range: Date[];
  date_start: string;
  date_end: string;
}
export class SaleReportFilter {
  company: string;
  company_id: number;
  product: string;
  product_id: number;
  product_type: string;
  product_type_id = 0;
  sale_date: Date[];
  sale_start: string;
  sale_end: string;
  start_time = '';
  end_time = '';
  generic: string;
  date_start: string;
  date_end: string;
  invoice: string;
  sales_man: string;
  customer_name: string;
  customer_mobile: string;
  payment_type = '';
  due_amount: string;
}
export class PayoutModel {
  sale_id: number;
  amount: number;
  // status: string;
}
