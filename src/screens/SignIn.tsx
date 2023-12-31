import { useNavigation } from '@react-navigation/native'
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  MailIcon,
  LockIcon,
} from '@gluestack-ui/themed'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      position="relative"
    >
      <Image
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt="Pessoas treinando"
        resizeMode="cover"
        position="absolute"
        h="$2/3"
        w="$full"
      />
      <VStack flex={1} px={10} py="$16" justifyContent="space-between">
        <Center my={24}>
          <LogoSvg />

          <Text color="$blueGray100" size="sm">
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center rowGap="$3" marginTop="$12">
          <Heading
            color="$blueGray100"
            fontSize="$xl"
            mb={6}
            fontFamily="$heading"
          >
            Acesse a conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            Icon={MailIcon}
          />
          <Input Icon={LockIcon} placeholder="Senha" secureTextEntry />

          <Button title="Acessar" />
        </Center>

        <Center mt={24}>
          <Text
            color="$blueGray100"
            fontSize="$sm"
            mb={3}
            // fontFamily="$body"
          >
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar Conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
