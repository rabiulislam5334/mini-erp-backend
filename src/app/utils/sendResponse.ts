import { Response } from "express";

export interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IMeta;
  data?: T;
}

const sendResponse = <T>(res: Response, payload: IApiResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message,
    meta: payload.meta ?? undefined,
    data: payload.data ?? undefined,
  });
};

export default sendResponse;
