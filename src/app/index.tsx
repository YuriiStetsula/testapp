/* eslint-disable react-hooks/exhaustive-deps */
import { useThemeColor } from '@/hooks/useThemeColor'
import { normalizeUrl } from '@/utils/normalizeUrl'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'

const WEBSITE_BASE = process.env.EXPO_PUBLIC_API_URL
const DEFAULT_URL = `${process.env.EXPO_PUBLIC_API_URL}/`
const USER_AGENT = 'bsgapp'

const Index = () => {
  const params = useLocalSearchParams<{ url?: string }>()
  const primaryColor = useThemeColor({}, 'primary')

  const [currentUrl, setCurrentUrl] = useState<string>(
    params?.url
      ? normalizeUrl({ url: params.url, baseUrl: WEBSITE_BASE })
      : DEFAULT_URL,
  )
  const [loading, setLoading] = useState(true)

  // When drawer selects a menu item, it passes `url`
  useEffect(() => {
    if (params?.url !== currentUrl) {
      const normalizedUrl = normalizeUrl({
        url: params.url,
        baseUrl: WEBSITE_BASE,
      })
      setCurrentUrl(normalizedUrl)
    }
  }, [params?.url])

  return (
    <View style={[styles.root, { backgroundColor: primaryColor }]}>
      <WebView
        source={{ uri: currentUrl }}
        userAgent={USER_AGENT}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={[styles.web, { backgroundColor: primaryColor }]}
      />

      {loading && (
        <View style={[styles.loading, { backgroundColor: primaryColor }]}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  web: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Index
