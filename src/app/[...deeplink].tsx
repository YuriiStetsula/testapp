import { Redirect, useLocalSearchParams } from 'expo-router'
import React from 'react'

const DeepLinkCatchAll = () => {
  const params = useLocalSearchParams<{ deeplink?: string[] }>()
  const parts = params.deeplink ?? []
  const route = parts[0] ?? ''

  if (route === 'events') {
    return (
      <Redirect
        href={{
          pathname: '/',
          params: {
            url: '/anlegerclub/events/',
          },
        }}
      />
    )
  }

  return (
    <Redirect
      href={{
        pathname: '/',
        params: { url: '/' },
      }}
    />
  )
}

export default DeepLinkCatchAll
