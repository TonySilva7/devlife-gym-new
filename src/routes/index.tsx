import { Box, useToken } from '@gluestack-ui/themed'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

export function Routes() {
  const gray700 = useToken('colors', 'gray700')

  const theme = DefaultTheme
  theme.colors.background = gray700

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AppRoutes />
      </NavigationContainer>
    </Box>
  )
}
