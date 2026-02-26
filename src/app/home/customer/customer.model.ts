export interface Customer {
  id: number;
  name: string;
  code: string;
  mobile: string;
  email: string;
  nid: string;
  address: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE';
  pharmacy_branch?: any;
}

export interface Pagination {
    total: number;
    page_no: number;
    limit: number;
    total_pages: number;
}

export interface CustomerData {
  data: Customer[],
  pagination: Pagination
}
