import { Ionicons } from '@expo/vector-icons'
import { useDrawerStatus } from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import { useNavigationContainerRef } from 'expo-router'
import { Pressable } from 'react-native'

export const HeaderRightToggle = () => {
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
      <Ionicons name={isOpen ? 'close' : 'menu'} size={25} color="white" />
    </Pressable>
  )
}
