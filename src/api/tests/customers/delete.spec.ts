import { test, expect } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateDeleteResponse, validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { ERRORS } from 'data/errors.data';

test.describe('[API] [Customers] [Delete]', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.beforeEach(async ({ customersApiSetvice }) => {
    customer = await customersApiSetvice.create(token);
  });

  test(
    'Should DELETE the customer by correct ID',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseDelete = await customersController.delete(customer._id, token);
      validateDeleteResponse(responseDelete);
      expect(responseDelete.body).toBe('');
      const responseGetID = await customersController.getById(customer._id, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, ERRORS.CUSTOMER_NOT_FOUND(customer._id));
    },
  );
});
