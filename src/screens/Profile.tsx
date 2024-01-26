import {
  Center,
  CheckIcon,
  Heading,
  Icon,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
  HStack,
  InfoIcon,
} from '@gluestack-ui/themed'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Controller, Resolver, useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api, userService } from '@services/api'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { AppError } from '@utils/AppError'

import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Skeleton } from '@components/Skeleton'
import { UserPhoto } from '@components/UserPhoto'

type IFileSystem = {
  exists: true
  uri: string
  size: number
  isDirectory: boolean
  modificationTime: number
  md5?: string | undefined
}

export type FormDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (val: string | null) => val && val.length > 0,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação de senha.')
          .transform((value) => value || null),
    }),
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/TonySilva7.png',
  )

  const toast = useToast()

  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema) as unknown as Resolver<FormDataProps>,
  })

  async function handleUserPhotoSelected() {
    setPhotoIsLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )) as IFileSystem

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: () => (
              <VStack
                bg="$red500"
                p="$4"
                borderRadius="$md"
                alignItems="center"
              >
                <Text color="$gray100" textAlign="center">
                  Essa imagem é muito grande. Escolha uma de até 5MB.
                </Text>
              </VStack>
            ),
          })
        }

        // setUserPhoto(photoSelected.assets[0].uri)
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any

        console.log(photoFile)

        const userPhotoUploadForm = new FormData()

        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse =
          await userService.updateImageProfile(userPhotoUploadForm)

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        await updateUserProfile(userUpdated)

        toast.show({
          placement: 'top',
          render: ({ id }) => {
            const toastId = 'toast-' + id

            return (
              <Toast nativeID={toastId} action="success" variant="solid">
                <VStack space="xs" w="$full">
                  <HStack alignItems="center" columnGap="$1">
                    <Icon as={CheckIcon} color="$green700" />
                    <ToastTitle fontFamily="$heading">Sucesso!</ToastTitle>
                  </HStack>
                  <ToastDescription>Foto atualizada!</ToastDescription>
                </VStack>
              </Toast>
            )
          },
        })

        console.log(photoFile)
      }
    } catch (error) {
      console.log(error)

      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível atualizar a foto. Tente novamente mais tarde.'

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
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await userService.updateUserData(data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id

          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs" w="$full">
                <HStack alignItems="center" columnGap="$1">
                  <Icon as={CheckIcon} color="$green700" />
                  <ToastTitle fontFamily="$heading">Sucesso!</ToastTitle>
                </HStack>
                <ToastDescription>
                  Perfil atualizado com sucesso!
                </ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

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
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$4" rowGap="$4">
          {photoIsLoading ? (
            <Skeleton />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size="md"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelected}>
            <Text
              color="$green500"
              fontWeight="bold"
              fontSize="$md"
              mt={2}
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            color="$gray200"
            fontSize="$md"
            mb={2}
            alignSelf="flex-start"
            mt={12}
            fontFamily="$heading"
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt="$4"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
