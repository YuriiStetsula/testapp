import { useDrawerStatus } from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import { useNavigationContainerRef } from 'expo-router'
import { Pressable, Text } from 'react-native'

export const HeaderRightToggle = () => {
  // const navigation = useNavigation()
  const status = useDrawerStatus()

  const isOpen = status === 'open'
  const rootNavigation = useNavigationContainerRef()

  const toggle = () => {
    rootNavigation?.dispatch(DrawerActions.toggleDrawer())
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isOpen ? 'Close menu' : 'Open menu'}
      onPress={toggle}
      hitSlop={12}
      style={{ paddingHorizontal: 14, paddingVertical: 8 }}
    >
      <Text style={{ color: 'white', fontSize: 28, lineHeight: 28 }}>
        {isOpen ? '×' : '≡'}
      </Text>
    </Pressable>
  )
}
