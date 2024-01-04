/* eslint-disable camelcase */
import { StatusBar } from 'react-native'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { useFonts } from 'expo-font'
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Routes } from '@routes/index'
import { Loading } from '@components/Loading'
import React from 'react'
import { config } from './src/theme'
import { AuthContextProvider } from '@contexts/AuthContext'

export default function App() {
  const [fontsLoaded, error] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  if (!fontsLoaded) return null

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded && !error ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  )
}
