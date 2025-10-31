// src/utils/api/msw/handlers/index.js
import { http, HttpResponse } from 'msw'
import { jobsHandlers } from './jobsHandlers.js'
import { candidatesHandlers } from './candidatesHandlers.js'
import { assessmentsHandlers } from './assessmentsHandlers.js'
import { applicationhandler } from './applicationhandler.js'

export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers,
  ...assessmentsHandlers,
  ...applicationhandler,
]

export { http, HttpResponse }
export default handlers
