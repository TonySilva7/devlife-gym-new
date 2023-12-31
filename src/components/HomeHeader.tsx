import {
  DownloadIcon,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'

import { UserPhoto } from './UserPhoto'

export function HomeHeader() {
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center">
      <UserPhoto
        source={{ uri: 'https://github.com/TonySilva7.png' }}
        size="sm"
        alt="Imagem do usuário"
        mr="$4"
      />

      <VStack flex={1}>
        <Text color="$gray100" fontSize="$md">
          Olá,
        </Text>

        <Heading color="$gray100" fontSize="$md" fontFamily="$heading">
          Tony
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon
          as={DownloadIcon}
          color="$gray200"
          size="md"
          style={{ transform: [{ rotate: '-90deg' }] }}
        />
      </TouchableOpacity>
    </HStack>
  )
}
