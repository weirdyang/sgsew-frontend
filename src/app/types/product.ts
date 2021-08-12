export interface IProduct {
    name: string,
    description: string,
    productType: string,
    brand: string,
    price: number,
}
export interface IProductEdit extends IProduct {
    user: string,
    id: string,
}
export interface IProductDisplay extends IProduct {
    user: string,
    _id: string,
}
export interface IProductResults {
    data: IProductDisplay[],
    count: number;
}