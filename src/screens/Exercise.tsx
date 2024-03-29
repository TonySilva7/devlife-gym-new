import {
  ArrowLeftIcon,
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
  useToast,
  ToastTitle,
  Toast,
  InfoIcon,
  ToastDescription,
  CheckIcon,
} from '@gluestack-ui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import SeriesSvg from '@assets/series.svg'
import { Button } from '@components/Button'
import { useEffect, useState } from 'react'
import { api, exerciseService } from '@services/api'
import { AppError } from '@utils/AppError'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [sendingRegister, setSendingRegister] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const { exerciseId } = route.params as RouteParamsProps

  const toast = useToast()

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)

      const response = await exerciseService.getExerciseById(exerciseId)

      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício'

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
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)

      await exerciseService.saveHistory(exerciseId)

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id

          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs" w="$full">
                <HStack alignItems="center" columnGap="$1">
                  <Icon as={CheckIcon} color="$green500" />
                  <ToastTitle fontFamily="$heading">Sucesso!</ToastTitle>
                </HStack>
                <ToastDescription>
                  Parabéns! Exercício registrado no seu histórico.
                </ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível registrar exercício.'

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
      setSendingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeftIcon} color="$green500" size="md" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt="$4"
          mb="$8"
          alignItems="center"
        >
          <Heading
            color="$gray100"
            fontSize="$lg"
            flexShrink={1}
            fontFamily="$heading"
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack p="$8">
          <Image
            w="$full"
            h="$80"
            source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
            }}
            alt="Nome do exercício"
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
          />

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack>
                <SeriesSvg />

                <Text color="$gray200" ml="$2">
                  {exercise.series} séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />

                <Text color="$gray200" ml="$2">
                  {exercise.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Marcar como realizado"
              isLoading={sendingRegister}
              onPress={handleExerciseHistoryRegister}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  )
}
