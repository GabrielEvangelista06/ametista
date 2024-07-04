import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'

import { getUserCards } from './actions'

export type Card =
  ReturnTypeWithoutPromise<typeof getUserCards> extends Array<infer T>
    ? T
    : never
