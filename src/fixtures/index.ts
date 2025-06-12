import { mergeTests } from '@playwright/test';
import { test as api_services } from './api-services.fixture';
import { test as controllers } from './controllers.fixture';

const test = mergeTests(api_services, controllers);

export { test };

export { expect } from '@playwright/test';
