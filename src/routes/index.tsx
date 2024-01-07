import { Box, useToken } from '@gluestack-ui/themed'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import { useAuth } from '@hooks/useAuth'
import { Loading } from '@components/Loading'

export function Routes() {
  const gray700 = useToken('colors', 'gray700')
  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = gray700

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
