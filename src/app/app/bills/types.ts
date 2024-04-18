import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'

import { getUserBillsByCardIds } from './actions'

export type Bill = ReturnTypeWithoutPromise<typeof getUserBillsByCardIds>[0]
