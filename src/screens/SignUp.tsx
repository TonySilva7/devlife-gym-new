/* eslint-disable camelcase */
import {
  AddIcon,
  Center,
  Heading,
  Image,
  LockIcon,
  MailIcon,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Button } from '@components/Button'
import { Input } from '@components/Input'

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

  function handleSignUp({
    name,
    email,
    password,
    password_confirm,
  }: FormDataProps) {
    console.log({ name, email, password, password_confirm })
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
