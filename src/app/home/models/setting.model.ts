export class MasterProductsModel {
    brand_name: string;
    medicine_company: string;
    medicine_type: number;
    generic_name: string;
}

export class MasterProductsFilterModel {
    company_id: number;
    company_name: string;
    medicine_id: number;
    medicine: string;
    type_id: number;
    generic: string;
}