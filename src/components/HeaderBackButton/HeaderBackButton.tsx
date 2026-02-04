import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'

interface HeaderBackButtonProps {
  onPress: () => void
}

export const HeaderBackButton = ({ onPress }: HeaderBackButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      hitSlop={12}
      style={{ paddingHorizontal: 14, paddingVertical: 8 }}
    >
      <Ionicons name="arrow-back" size={24} color="white" />
    </Pressable>
  )
}
