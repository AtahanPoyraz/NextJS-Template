import { createLogger } from './logger';
import { config } from './logger-config';

export const logger = createLogger({ level: config.logLevel });