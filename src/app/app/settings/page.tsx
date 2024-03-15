import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageHeaderTitle,
  LayoutPageMain,
} from '@/components/layouts/PageLayout'

export default function SettingsPage() {
  return (
    <LayoutPage>
      <LayoutPageHeader>
        <LayoutPageHeaderTitle>Configurações</LayoutPageHeaderTitle>
      </LayoutPageHeader>
      <LayoutPageMain>
        <h1>Configurações</h1>
      </LayoutPageMain>
    </LayoutPage>
  )
}
