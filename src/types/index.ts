export interface Person {
    id?: number;
    name: string;
    age: number;
}

export interface Product {
    id?: number;
    name: string;
    price: number;
}

export interface Order {
    id?: number;
    personId: number;
    productIds: number[];
}
