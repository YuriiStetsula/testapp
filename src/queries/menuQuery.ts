import { fetchJson } from '@/api/fetchJson'
import { useQuery } from '@tanstack/react-query'

type MenuItemType = 'MenuItem'

export interface MenuItem {
  type: MenuItemType
  menuLabel: string
  url: string
  secure: boolean
  menuItems?: MenuItem[]
}

type MenuResponse = MenuItem[] | { menuItems: MenuItem[] }

const normalizeMenuResponse = (raw: MenuResponse): MenuItem[] => {
  if (Array.isArray(raw)) {
    return raw
  }

  if (raw && typeof raw === 'object' && Array.isArray((raw as any).menuItems)) {
    return (raw as any).menuItems
  }
  return []
}

export const useMenuQuery = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const raw = await fetchJson<MenuResponse>(
        '/api/bsg-feature-navigation/MenuConfiguration/GetConfiguration',
      )
      return normalizeMenuResponse(raw)
    },
  })
}
