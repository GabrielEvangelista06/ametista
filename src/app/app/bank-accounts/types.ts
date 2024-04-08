import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'

import { getUserBankInfos } from './actions'

export type BankInfo = ReturnTypeWithoutPromise<typeof getUserBankInfos>[0]
