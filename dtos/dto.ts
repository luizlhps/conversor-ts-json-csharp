export interface Service extends BaseEntity {
    name: string;
    duration: string;
    price: number;
    ativo: boolean;
    statusId: number;
    status: Status;
    companyId: number;
    company: Company;
}