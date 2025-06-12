import { expect } from '@playwright/test';
import { IResponse, IResponseFields } from 'types';

export function validateResponse<T extends IResponseFields>(
  response: IResponse<T>,
  status: number,
  IsSuccess: boolean,
  ErrorMessage: string | null,
) {
  expect.soft(response.status).toBe(status);
  expect.soft(response.body.IsSuccess).toBe(IsSuccess);
  expect.soft(response.body.ErrorMessage).toBe(ErrorMessage);
}

export function validateDeleteResponse(response: IResponse<null>, status: number) {
  expect.soft(response.status).toBe(status);
  expect.soft(response.body).toBe('');
}
