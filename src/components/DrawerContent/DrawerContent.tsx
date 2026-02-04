import { useThemeColor } from '@/hooks/useThemeColor'
import { useMenuQuery } from '@/queries/menuQuery'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DrawerTreeFlatList } from './components/DrawerList'
import { HeaderRightToggle } from './components/HeaderRightToggle'

interface DrawerContentProps {
  onNavigate: (url: string) => void
}

export const DrawerContent = ({ onNavigate }: DrawerContentProps) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const primaryColor = useThemeColor({}, 'primary')

  const { data: items = [], isLoading, error } = useMenuQuery()

  const toggleExpanded = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <View style={[styles.drawerRoot, { backgroundColor: primaryColor }]}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerBrand}>Börse{'\n'}Stuttgart</Text>
        <HeaderRightToggle />
      </View>

      <View style={styles.drawerList}>
        {isLoading && <Text style={styles.muted}>Loading…</Text>}
        {error && <Text style={styles.muted}>{error.message}</Text>}

        {!isLoading && !error && (
          <DrawerTreeFlatList
            items={items}
            expandedKeys={expandedKeys}
            toggleExpanded={toggleExpanded}
            onNavigate={onNavigate}
            parentKey="root"
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1,
    paddingTop: 60,
  },
  drawerHeader: {
    paddingHorizontal: 22,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  drawerBrand: {
    color: 'white',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 42,
  },
  drawerList: {
    paddingHorizontal: 0,
    paddingBottom: 24,
    flex: 1,
  },
  muted: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 22,
    paddingTop: 8,
  },
})
