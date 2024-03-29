import {
  Center,
  HStack,
  Heading,
  Icon,
  Image,
  InfoIcon,
  LockIcon,
  MailIcon,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { AppError } from '@utils/AppError'
import * as yup from 'yup'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const { signIn } = useAuth()
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signInSchema),
  })

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const message = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      setIsLoading(false)

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id

          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs" w="$full">
                <HStack alignItems="center" columnGap="$1">
                  <Icon as={InfoIcon} color="$red700" />
                  <ToastTitle fontFamily="$heading">Oops!</ToastTitle>
                </HStack>
                <ToastDescription>{message}</ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })
    }
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

          <Controller
            control={control}
            name="email"
            // rules={{ required: 'Informe o e-mail', pattern: /\S+@\S+\.\S+/ }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
                Icon={MailIcon}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            // rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                Icon={LockIcon}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color="$blueGray100" fontSize="$sm" mb={3} fontFamily="$body">
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
