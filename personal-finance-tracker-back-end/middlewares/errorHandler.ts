import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiResponse) {
    res.status(err.statusCode).json(err);
  } else {
    console.error(err);
    res.status(500).json(ApiResponse.error("Internal Server Error"));
  }
};
