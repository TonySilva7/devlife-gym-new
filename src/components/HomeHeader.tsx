import {
  DownloadIcon,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { UserPhoto } from './UserPhoto'
import { useAuth } from '@hooks/useAuth'

export function HomeHeader() {
  const { user, signOut } = useAuth()
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center">
      <UserPhoto
        source={user.avatar ? { uri: user.avatar } : defaultUserPhotoImg}
        size="sm"
        alt="Imagem do usuário"
        mr="$4"
      />

      <VStack flex={1}>
        <Text color="$gray100" fontSize="$md">
          Olá,
        </Text>

        <Heading color="$gray100" fontSize="$md" fontFamily="$heading">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
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
