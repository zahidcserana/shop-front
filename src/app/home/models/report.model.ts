export class ExpiryFilterModel {
    company_id: number;
    company: string;
    medicine: string;
    exp_type: string;
    medicine_id: number;
    expiry_date: Date[];
  }

export class StockFilterModel {
  medicine_id: number;
  medicine: string;
  date_range: Date[];
}