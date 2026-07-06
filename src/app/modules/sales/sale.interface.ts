import { Types } from "mongoose";

export interface ISaleItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale {
  customer: Types.ObjectId;
  items: ISaleItem[];
  grandTotal: number;
  createdBy: Types.ObjectId;
}

// Shape of the incoming request body from frontend
export interface ICreateSalePayload {
  customer: string;
  items: {
    product: string;
    quantity: number;
  }[];
}
