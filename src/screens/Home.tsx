import {
  FlatList,
  HStack,
  Heading,
  Icon,
  InfoIcon,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { ExerciseDTO } from '@dtos/ExerciseDTO'

import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { exerciseService } from '@services/api'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])

  const [groupSelected, setGroupSelected] = useState('bíceps')

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  const fetchGroups = useCallback(async () => {
    try {
      const response = await exerciseService.getGroups()
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares'

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
  }, [toast])

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)

      const response = await exerciseService.getExercisesByGroup(groupSelected)

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios'

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

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item as string}
        renderItem={({ item }) => (
          <Group
            name={item as string}
            isActive={
              groupSelected.toLocaleUpperCase() ===
              (item as string).toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item as string)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        py="$1"
        my="$4"
        maxHeight="$16"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>

            <Text color="$gray200" fontSize="$sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item, index) =>
              `${(item as ExerciseDTO).id}_${index}`
            }
            renderItem={({ item }) => (
              <ExerciseCard
                data={item as ExerciseDTO}
                onPress={() =>
                  handleOpenExerciseDetails((item as ExerciseDTO).id)
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  )
}
