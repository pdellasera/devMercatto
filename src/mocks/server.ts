import { setupServer } from 'msw/node';
import { handlers } from '../test-utils/mocks/handlers';

export const server = setupServer(...handlers);
