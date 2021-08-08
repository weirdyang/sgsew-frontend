export interface IProduct {
    name: string,
    description: string,
    productType: string,
    brand: string,
    price: number,
}
export interface IProductEdit extends IProduct {
    user: string;
    id: string;
}