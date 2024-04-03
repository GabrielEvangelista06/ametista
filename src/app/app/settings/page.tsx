import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'

export default function SettingsPage() {
  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Configurações</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain>
        <h1>Configurações</h1>
      </PageLayoutMain>
    </PageLayout>
  )
}
