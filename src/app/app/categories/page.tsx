import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNav,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { CategoriesDataTable } from './_components/CategoriesDataTable'
import { CategoryUpsertSheet } from './_components/CategoryUpsertSheet'
import { getUserCategories } from './actions'
import { Category } from './types'

export default async function CategoriesPage() {
  const categories: Category[] = await getUserCategories()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Categorias</PageLayoutHeaderTitle>
        <PageLayoutHeaderNav>
          <CategoryUpsertSheet>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar categoria
            </Button>
          </CategoryUpsertSheet>
        </PageLayoutHeaderNav>
      </PageLayoutHeader>
      <PageLayoutMain>
        <CategoriesDataTable data={categories} />
      </PageLayoutMain>
    </PageLayout>
  )
}
