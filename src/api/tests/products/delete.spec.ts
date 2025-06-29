import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { errorResponseSchema } from 'data/schemas';
import { test } from 'fixtures';
import { IResponse, IResponseFields } from 'types';
import { generateID } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Products] [Delete]', async () => {
  let token = '';
  let createdProductId = '';

  test.beforeEach(async ({ productsApiService, signInApiService }) => {
    token = await signInApiService.getAuthToken();
    createdProductId = (await productsApiService.create(token))._id;
  });

  test.afterEach(async ({ productsApiService, productsController }) => {
    const isProductExists = (await productsController.getById(createdProductId, token)).status === STATUS_CODES.OK;
    if (isProductExists) {
      await productsApiService.delete(createdProductId, token);
    }
  });

  test(
    'Should delete product by ID',
    { tag: ['@1_P_DL_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.delete(createdProductId, token);
      validateDeleteResponse(response);

      test.step("Product isn't found via getById", async () => {
        const deletedProduct = await productsController.getById(createdProductId, token);
        validateResponse(deletedProduct, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(createdProductId));
      });
    },
  );

  test(
    'Should return 404 error for non-existent ID',
    { tag: ['@2_P_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const nonExistentId = generateID();
      const response = await productsController.delete(nonExistentId, token);

      validateSchema(errorResponseSchema, response.body as unknown as IResponse<IResponseFields>);
      validateResponse(
        response as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.PRODUCT_NOT_FOUND(nonExistentId),
      );
    },
  );

  test(
    'Should return 404 error for invalid format ID',
    { tag: ['@3_P_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const invalidID = '12345';
      const response = await productsController.delete(invalidID, token);

      validateSchema(errorResponseSchema, response.body as unknown as IResponse<IResponseFields>);
      validateResponse(
        response as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.PRODUCT_NOT_FOUND(invalidID),
      );
    },
  );

  test(
    'Should return 401 error for existing product when token is missed',
    { tag: ['@4_P_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.delete(createdProductId, '');

      validateSchema(errorResponseSchema, response.body as unknown as IResponse<IResponseFields>);
      validateResponse(
        response as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.EMPTY_TOKEN,
      );
    },
  );

  test(
    'Should return 401 error for existing product when token is invalid',
    { tag: ['@5_P_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.delete(createdProductId, '1234');

      validateSchema(errorResponseSchema, response.body as unknown as IResponse<IResponseFields>);
      validateResponse(
        response as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.INVALID_TOKEN,
      );
    },
  );

  test(
    'Should return 400 error when product is added to order',
    { tag: ['@6_P_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController, ordersController, customersApiService, ordersApiService }) => {
      const customer = (await customersApiService.create(token))._id;
      const orderId = (await ordersController.create({ customer, products: [createdProductId] }, token)).body.Order._id;

      const response = await productsController.delete(createdProductId, token);

      validateSchema(errorResponseSchema, response.body as unknown as IResponse<IResponseFields>);
      validateResponse(
        response as unknown as IResponse<IResponseFields>,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IN_ORDER,
      );

      await ordersApiService.deleteOrder(orderId, token);
      await customersApiService.delete(customer, token);
    },
  );
});
