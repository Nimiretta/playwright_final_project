import { STATUS_CODES, TAGS } from 'data';
import { orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import _ from 'lodash';
import { ICustomerFromResponse, IOrderFromResponse, IProductFromResponse } from 'types';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Update Order]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let customer: ICustomerFromResponse;
  let products: IProductFromResponse[];
  let productIds: string[];
  test.beforeEach(async ({ ordersApiService, signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ ordersApiService, productsApiService, customersApiService }) => {
    await ordersApiService.clear(token);
    await Promise.all(productIds.map((el) => productsApiService.delete(el, token)));
    await customersApiService.delete(customer._id, token);
  });

  test(
    'Should update order with all valid data (token, valid customerId, productId)',
    { tag: ['@001_O_PUT_API', TAGS.API, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: productIds },
        token,
      );
      validateSchema(orderSchema, updateResponse.body);
      validateResponse(updateResponse, STATUS_CODES.OK, true, null);
      expect.soft(updateResponse.body.Order.customer).toMatchObject({ ...customer });
      updateResponse.body.Order.products.forEach((el) =>
        expect.soft(el).toMatchObject(_.omit({ ...products.find((data) => data._id === el._id) }, 'createdOn')),
      );
    },
  );
});
