/* eslint-disable react-hooks/exhaustive-deps */
import { HeaderBackButton } from '@/components/HeaderBackButton'
import { useThemeColor } from '@/hooks/useThemeColor'
import { normalizeUrl } from '@/utils/normalizeUrl'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { WebViewNavigation } from 'react-native-webview'
import { WebView } from 'react-native-webview'

const WEBSITE_BASE = process.env.EXPO_PUBLIC_API_URL
const DEFAULT_URL = `${process.env.EXPO_PUBLIC_API_URL}/`
const USER_AGENT = 'bsgapp'
const LOADING_TIMEOUT = 5000 // 5 seconds

const Index = () => {
  const params = useLocalSearchParams<{ url?: string }>()
  const primaryColor = useThemeColor({}, 'primary')
  const webViewRef = useRef<WebView>(null)
  const [canGoBack, setCanGoBack] = useState(false)

  const [currentUrl, setCurrentUrl] = useState<string>(
    params?.url
      ? normalizeUrl({ url: params.url, baseUrl: WEBSITE_BASE })
      : DEFAULT_URL,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasTimeout, setHasTimeout] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // When drawer selects a menu item, it passes `url`
  useEffect(() => {
    if (params?.url !== currentUrl) {
      const normalizedUrl = normalizeUrl({
        url: params.url,
        baseUrl: WEBSITE_BASE,
      })
      setCurrentUrl(normalizedUrl)
      setError(null)
      setHasTimeout(false)
    }
  }, [params?.url])

  useEffect(() => {
    if (loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (loading) {
          setHasTimeout(true)
          setLoading(false)
        }
      }, LOADING_TIMEOUT)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setHasTimeout(false)
    }
  }, [loading])

  const navigation = useNavigation()

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack)
    if (navState.loading === false) {
      setError(null)
      setHasTimeout(false)
    }
  }

  const handleError = (syntheticEvent: {
    nativeEvent: { description?: string; code?: number }
  }) => {
    const { nativeEvent } = syntheticEvent
    setError(nativeEvent.description || 'Failed to load page')
    setLoading(false)
  }

  const handleLoadStart = () => {
    setLoading(true)
    setError(null)
    setHasTimeout(false)
  }

  const handleLoadEnd = () => {
    setLoading(false)
    setHasTimeout(false)
  }

  const handleBackPress = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack()
    }
  }, [canGoBack])

  const handleReload = useCallback(() => {
    setError(null)
    setHasTimeout(false)
    setLoading(true)
    if (webViewRef.current) {
      webViewRef.current.reload()
    }
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: canGoBack
        ? () => <HeaderBackButton onPress={handleBackPress} />
        : () => null,
    })
  }, [canGoBack, navigation, handleBackPress])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack()
          return true
        }
        return false
      },
    )

    return () => backHandler.remove()
  }, [canGoBack])

  return (
    <View style={[styles.root, { backgroundColor: primaryColor }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        userAgent={USER_AGENT}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleError}
        onNavigationStateChange={handleNavigationStateChange}
        style={[styles.web, { backgroundColor: primaryColor }]}
      />

      {loading && !error && !hasTimeout && (
        <View style={[styles.loading, { backgroundColor: primaryColor }]}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}

      {(error || hasTimeout) && (
        <View
          style={[styles.errorContainer, { backgroundColor: primaryColor }]}
        >
          <Text style={styles.errorText}>
            {hasTimeout
              ? 'Loading is taking longer than expected. Please check your connection and try again.'
              : error || 'An error occurred while loading the page.'}
          </Text>
          <Pressable
            onPress={handleReload}
            style={({ pressed }) => [
              styles.reloadButton,

              pressed && styles.reloadButtonPressed,
            ]}
          >
            <Text style={[styles.reloadButtonText, { color: primaryColor }]}>
              Reload
            </Text>
          </Pressable>
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
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  reloadButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reloadButtonPressed: {
    opacity: 0.8,
  },
  reloadButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
})

export default Index
