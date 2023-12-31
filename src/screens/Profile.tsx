import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  useToast,
} from '@gluestack-ui/themed'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

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

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/TonySilva7.png',
  )

  const toast = useToast()

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

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10" rowGap="$4">
          {photoIsLoading ? (
            <Skeleton />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
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

          <Input bg="$gray600" placeholder="Nome" />

          <Input bg="$gray600" placeholder="E-mail" isDisabled />

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

          <Input bg="$gray600" placeholder="Senha antiga" secureTextEntry />

          <Input bg="$gray600" placeholder="Nova senha" secureTextEntry />

          <Input
            bg="$gray600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt="$4" />
        </Center>
      </ScrollView>
    </VStack>
  )
}
