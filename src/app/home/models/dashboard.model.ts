export class DashboardModel {
  total_order: number;
  total_sale: number;
  total_medicine: number;
  total_customer: number;
}

export class DamageFilterModel {
  company: string;
  company_id: number;
  invoice: string;
  company_invoice: string;
  damage_date: Date[];
  date_start: string;
  date_end: string;
}