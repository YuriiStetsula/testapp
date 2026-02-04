import { router } from 'expo-router'

import { QueryProvider } from '@/api/QueryProvider'
import { DrawerContent } from '@/components/DrawerContent'
import { HeaderRightToggle } from '@/components/DrawerContent/components/HeaderRightToggle'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Drawer } from 'expo-router/drawer'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const RootLayout = () => {
  const primaryColor = useThemeColor({}, 'primary')

  const onNavigate = (menuUrl: string) => {
    router.push({ pathname: '/', params: { url: menuUrl } })
  }

  const headerRight = useCallback(() => <HeaderRightToggle />, [])

  const drawerContent = useCallback(
    () => <DrawerContent onNavigate={onNavigate} />,
    [],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <Drawer
          screenOptions={{
            headerStyle: { backgroundColor: primaryColor },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerTitleAlign: 'center',
            headerLeft: () => null,
            headerRight,
            drawerPosition: 'right',
            drawerStyle: { width: '100%', backgroundColor: primaryColor },
            ...(Platform.OS === 'ios' ? { headerShadowVisible: false } : {}),
          }}
          drawerContent={drawerContent}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: 'Börse Stuttgart',
            }}
          />
        </Drawer>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}

export default RootLayout
