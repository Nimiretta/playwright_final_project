import { test, expect } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateDeleteResponse, validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { ERRORS } from 'data/errors.data';
import { ObjectId } from 'bson';
import { IResponse, IResponseFields } from 'types/api.types';

test.describe('[API] [Customers] [Delete]', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.beforeEach(async ({ customersApiSetvice }) => {
    customer = await customersApiSetvice.create(token);
  });

  test.afterEach(async ({ customersApiSetvice }) => {
    if (customer._id) return;
    await customersApiSetvice.delete(customer._id, token);
  });

  test(
    '[1_C_DL_API] Should DELETE the customer by correct ID',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseDelete = await customersController.delete(customer._id, token);
      validateDeleteResponse(responseDelete);
      expect(responseDelete.body).toBe('');
      const responseGetID = await customersController.getById(customer._id, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, ERRORS.CUSTOMER_NOT_FOUND(customer._id));
    },
  );

  test(
    '[3_C_DL_API] Should NOT delete customer with a non-existent ID',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const nonexistentID = new ObjectId().toHexString();
      const responseDelete = await customersController.delete(nonexistentID, token);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.CUSTOMER_NOT_FOUND(nonexistentID),
      );
    },
  );

  test(
    '[4_C_DL_API] Should NOT delete customer with an invalid ID',
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const invalidID = '123';
      const responseDelete = await customersController.delete(invalidID, token);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.CUSTOMER_NOT_FOUND(invalidID),
      );
    },
  );
  test(
    '[5_C_DL_API] Should NOT delete  customer with correct ID  and  expired authorization token',
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const expiredToken =
        'eyJpZCI6IjY4MDRmMjcyZDAwNmJhM2Q0NzVmYjNlMCIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNzQ5NzE0MjIwLCJleHAiOjE3NDk4MDA2MjB9.5MDtQekidZ8aQNWYJULTJQkpcs5a2nT_1yvVMYGaaMU';
      const responseDelete = await customersController.delete(customer._id, expiredToken);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        ERRORS.EXPIRED_TOKEN,
      );
    },
  );
  test(
    '[6_C_DL_API]  Should NOT delete  customer with correct ID  and  empty  authorization token',
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const emptyToken = '';
      const responseDelete = await customersController.delete(customer._id, emptyToken);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        ERRORS.EMPTY_TOKEN,
      );
    },
  );
  test(
    '[7_C_DL_API]   Should NOT delete  customer with correct ID  and  incorrect / invalid  authorization token',
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const incorrectToken = '12345';
      const responseDelete = await customersController.delete(customer._id, incorrectToken);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        ERRORS.INVALID_TOKEN,
      );
    },
  );
});
