import express, { Application, Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(err);
  if (axios.isAxiosError(err)) {
    res.status(err.response?.status || 500).send({
      message: err.response?.statusText,
    });
  }
  res.status(500).send({
    message: err.message,
  });
};