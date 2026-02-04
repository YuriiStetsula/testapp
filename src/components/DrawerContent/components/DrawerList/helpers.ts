import { MenuItem } from '@/queries/menuQuery'

type FlatRow = {
  key: string
  item: MenuItem
  depth: number
  hasChildren: boolean
  isExpanded: boolean
  hasUrl: boolean
}

const stableKey = (item: MenuItem, parentKey: string, index: number) => {
  // prefer url if present, otherwise label-based key
  const u = (item.url ?? '').trim()
  const l = (item.menuLabel ?? '').trim()
  return `${parentKey}/${u || l || index}`
}

export const buildVisibleRows = (
  items: MenuItem[],
  expandedKeys: Set<string>,
  parentKey: string,
  depth: number,
): FlatRow[] => {
  const rows: FlatRow[] = []

  items.forEach((item, idx) => {
    const key = stableKey(item, parentKey, idx)
    const children = Array.isArray(item.menuItems) ? item.menuItems : []
    const hasChildren = children.length > 0
    const isExpanded = expandedKeys.has(key)
    const hasUrl = !!(item.url && item.url.trim().length > 0)

    rows.push({
      key,
      item,
      depth,
      hasChildren,
      isExpanded,
      hasUrl,
    })

    if (hasChildren && isExpanded) {
      rows.push(...buildVisibleRows(children, expandedKeys, key, depth + 1))
    }
  })

  return rows
}
