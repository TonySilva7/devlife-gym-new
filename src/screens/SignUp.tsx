/* eslint-disable camelcase */
import {
  AddIcon,
  Center,
  CheckCircleIcon,
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
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ElementType, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { userService } from '@services/api'
import { AppError } from '@utils/AppError'

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  const toast = useToast()
  const { signIn } = useAuth()

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true)

      const response = await userService.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      })

      const data = response.data

      if (data.status === 'error') {
        showToast(data.message, data.status)
        return
      }

      showToast('Usuário criado com sucesso', 'success')
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      setIsLoading(false)

      if (isAppError) {
        showToast(error.message, 'error')
      } else {
        showToast('Erro desconhecido!', 'error')
      }
    }
  }

  const showToast = (message: string, status: 'success' | 'error') => {
    console.log('Toast', message, status)

    toast.show({
      placement: 'top',
      render: ({ id }) => {
        const toastId = 'toast-' + id
        const title = status === 'success' ? 'Sucesso!' : 'Oops!'
        const ToastIcon: ElementType =
          status === 'success'
            ? (CheckCircleIcon as ElementType)
            : (InfoIcon as ElementType)

        const colorIcon = status === 'success' ? '$green700' : '$red700'

        return (
          <Toast nativeID={toastId} action={status} variant="solid">
            <VStack space="xs" w="$full">
              <HStack alignItems="center" columnGap="$1">
                <Icon as={ToastIcon} color={colorIcon} />
                <ToastTitle fontFamily="$heading">{title}</ToastTitle>
              </HStack>
              <ToastDescription>{message}</ToastDescription>
            </VStack>
          </Toast>
        )
      },
    })
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
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

          <Text color="$gray100" fontSize="$sm">
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center rowGap="$3" marginTop="$12">
          <Heading color="$gray100" fontSize="$xl" mb={6} fontFamily="$heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
                Icon={AddIcon}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                Icon={MailIcon}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                Icon={LockIcon}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar a Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
                Icon={LockIcon}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={12}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  )
}
