import { MenuItem } from '@/queries/menuQuery'
import { useMemo } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { buildVisibleRows } from './helpers'

interface DrawerTreeFlatListProps {
  items: MenuItem[]
  expandedKeys: Set<string>
  toggleExpanded: (key: string) => void
  onNavigate: (url: string) => void
  parentKey: string
}

export const DrawerTreeFlatList = ({
  items,
  expandedKeys,
  toggleExpanded,
  onNavigate,
  parentKey,
}: DrawerTreeFlatListProps) => {
  const rows = useMemo(
    () => buildVisibleRows(items, expandedKeys, parentKey, 0),
    [items, expandedKeys, parentKey],
  )

  console.log(rows)

  return (
    <FlatList
      data={rows}
      keyExtractor={row => row.key}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item: row }) => {
        const { key, item, depth, hasChildren, isExpanded, hasUrl } = row

        const onPressLabel = () => {
          if (hasUrl && !hasChildren) {
            onNavigate(item.url)
          } else if (hasChildren) {
            console.log('toggleExpanded', key)
            toggleExpanded(key)
          }
        }

        return (
          <View>
            <View style={[styles.row, { paddingLeft: 22 + depth * 16 }]}>
              <Pressable
                onPress={onPressLabel}
                style={({ pressed }) => [
                  styles.rowLabelArea,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.rowLabel}>{item.menuLabel}</Text>
              </Pressable>

              {hasChildren ? (
                <Pressable
                  onPress={() => toggleExpanded(key)}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.chevronBtn,
                    pressed && { opacity: 0.85 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <Text style={styles.chevronText}>
                    {isExpanded ? '˅' : '›'}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.chevronSpacer} />
              )}
            </View>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  rowLabelArea: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
  },
  rowLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  chevronBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  chevronText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '700',
  },
  chevronSpacer: {
    width: 22 + 14,
  },
})
