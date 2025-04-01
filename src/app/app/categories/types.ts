import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'

import { getUserCategories } from './actions'

export type Category = ReturnTypeWithoutPromise<typeof getUserCategories>[0]
