// src/utils/api/msw/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers/index.js'

export const worker = setupWorker(...handlers)
