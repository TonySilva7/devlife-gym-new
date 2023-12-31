import {
  ChevronRightIcon,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type Props = TouchableOpacityProps & object

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg',
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="center"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="white" fontFamily="$heading">
            Remanda unilateral
          </Heading>

          <Text fontSize="$sm" color="$gray200" mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={ChevronRightIcon} color="$gray200" />
      </HStack>
    </TouchableOpacity>
  )
}
