import { expect, test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { API_ERRORS } from 'data/errors.data';
import { IResponse, IResponseFields } from 'types/api.types';
import { generateID } from 'data/generateID.data';
import { errorResponseSchema } from 'data/schemas/errorResponse.schema';
import { validateSchema } from 'utils/validations/schemaValidation.utils';
import { customerSchema } from 'data/schemas/customers/customer.schema';
import { getAuthToken } from 'utils/authToken.utils';

test.describe('[API] [Customers] [GET by ID]', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  // test.beforeEach(async ({ signInApiService }) => {
  //   token = await signInApiService.loginAsLocalUser();
  // });

  test.beforeEach(async ({ page, customersApiService }) => {
    token = await getAuthToken(page);

    customer = await customersApiService.create(token);
  });

  test.afterEach(async ({ customersController }) => {
    if (!customer._id) return;
    await customersController.delete(customer._id, token);
  });

  test(
    'Should Get  the customer by correct ID',
    { tag: ['@1_C_GET_ID_API', TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseGetID = await customersController.getById(customer._id, token);
      validateResponse(responseGetID, STATUS_CODES.OK, true, null);
      validateSchema(customerSchema, responseGetID.body);
      expect.soft(responseGetID.body.Customer).toEqual(customer);
    },
  );

  test(
    'Should NOT Get customer with a non-existent ID',
    { tag: ['@2_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const nonexistentID = generateID();
      const responseGetID = await customersController.getById(nonexistentID, token);
      validateResponse(
        responseGetID as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.CUSTOMER_NOT_FOUND(nonexistentID),
      );
      validateSchema(errorResponseSchema, responseGetID.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    ' Should NOT Get customer with INVALID  format ID',
    { tag: ['@3_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const invalidID = '123';
      const responseGetID = await customersController.getById(invalidID, token);
      validateResponse(
        responseGetID as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.CUSTOMER_NOT_FOUND(invalidID),
      );
      validateSchema(errorResponseSchema, responseGetID.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should NOT delete  customer with correct ID  and  empty  authorization token',
    { tag: ['@4_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const emptyToken = '';
      const responseGetID = await customersController.getById(customer._id, emptyToken);
      validateResponse(
        responseGetID as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.EMPTY_TOKEN,
      );
      validateSchema(errorResponseSchema, responseGetID.body as unknown as IResponse<IResponseFields>);
    },
  );
  test(
    'Should NOT GET  customer with correct ID  and  incorrect / invalid  authorization token',
    { tag: ['@5_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const incorrectToken = '12345';
      const responseGetID = await customersController.delete(customer._id, incorrectToken);
      validateResponse(
        responseGetID as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.INVALID_TOKEN,
      );
      validateSchema(errorResponseSchema, responseGetID.body as unknown as IResponse<IResponseFields>);
    },
  );
});
