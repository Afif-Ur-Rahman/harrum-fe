import { GenerictEvents } from '@/types'
import createEventBus from './event-bus'

export const genericEventBus = createEventBus<GenerictEvents>()
