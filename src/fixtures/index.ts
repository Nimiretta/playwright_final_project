import { mergeTests } from '@playwright/test';
import { test as api_services } from './api-services.fixture';

const test = mergeTests(api_services);

export { test };

export { expect } from '@playwright/test';
