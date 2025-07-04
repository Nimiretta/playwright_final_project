import { apiConfig } from 'config';
import { NOTIFICATIONS, STATUS_CODES, TAGS } from 'data';
import { generateCommentData, ORDER_STATUSES } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderFromResponse, IOrderResponse } from 'types';
import { getRandromEnumValue } from 'utils';

test.describe('[E2E] [Orders] [Comments]', () => {
  test.describe.configure({ mode: 'serial' });
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    const orderStatus = getRandromEnumValue(ORDER_STATUSES);
    switch (orderStatus) {
      case ORDER_STATUSES.DRAFT:
        order = await ordersApiService.createDraft(token);
        break;
      case ORDER_STATUSES.IN_PROCESS:
        order = await ordersApiService.createInProcess(token);
        break;
      case ORDER_STATUSES.PARTIALLY_RECEIVED:
        order = await ordersApiService.createPartiallyReceived(token);
        break;
      case ORDER_STATUSES.RECEIVED:
        order = await ordersApiService.createReceived(token);
        break;
      case ORDER_STATUSES.CANCELED:
        order = await ordersApiService.createCanceled(token);
        break;
      default:
        throw new Error(`Unexpected order status: ${orderStatus}`);
    }
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should add a comment with valid data',
    {
      tag: ['@1_O_CMNTS_E2E', TAGS.E2E, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderDetailsPage }) => {
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.clickCommentsTab();
      await orderDetailsPage.commentsTab.waitForOpened();
      const newComment = generateCommentData().comment;

      await orderDetailsPage.commentsTab.fillCommentsInput(newComment);
      const response = await orderDetailsPage.interceptResponse<IOrderResponse, unknown[]>(
        apiConfig.ENDPOINTS.ORDER_COMMENTS_ADD(order._id),
        orderDetailsPage.commentsTab.clickCreateCommentButton.bind(orderDetailsPage.commentsTab),
      );
      const createdComment = response.body.Order.comments.find((comment) => comment.text === newComment);

      expect.soft(response.status).toBe(STATUS_CODES.OK);
      expect.soft(createdComment).toBeDefined();
      await orderDetailsPage.waitForNotification(NOTIFICATIONS.COMMENT_CREATED);

      await orderDetailsPage.commentsTab.waitForOpened();
      const commentsUI = await orderDetailsPage.commentsTab.getAllComments();
      expect.soft(commentsUI.find((comment) => comment.text === newComment)).toBeDefined();
    },
  );

  test(
    'Should delete comment',
    {
      tag: ['@2_O_CMNTS_E2E', TAGS.E2E, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersApiService, orderDetailsPage }) => {
      const addedComment = generateCommentData();
      const addedCommentId = (await ordersApiService.addComment(order._id, token, addedComment)).comments.find(
        (comment) => comment.text === addedComment.comment,
      )!._id;

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.clickCommentsTab();
      await orderDetailsPage.commentsTab.waitForOpened();

      await orderDetailsPage.commentsTab.clickDeleteButton(addedCommentId);

      await orderDetailsPage.waitForNotification(NOTIFICATIONS.COMMENT_DELETED);
      await orderDetailsPage.commentsTab.waitForOpened();
      const commentsUI = await orderDetailsPage.commentsTab.getAllComments();
      expect.soft(commentsUI.length).toBe(0);
    },
  );
});
