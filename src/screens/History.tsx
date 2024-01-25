import {
  Center,
  HStack,
  Heading,
  Icon,
  InfoIcon,
  SectionList,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'

import { exerciseService } from '@services/api'
import { AppError } from '@utils/AppError'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'
import { HistoryDTO } from '@dtos/HistoryDTO'

export function History() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await exerciseService.getHistory()

      if (response.data.length === 0) return

      setExercises(response.data)
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
  }, [toast])

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchHistory()
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []),
  // )

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList
        sections={exercises}
        keyExtractor={(item, index) => `${(item as HistoryDTO).id}__${index}`}
        renderItem={({ item }) => <HistoryCard data={item as HistoryDTO} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {(section as HistoryByDayDTO).title}
          </Heading>
        )}
        px="$4"
        // contentContainerStyle={
        //   exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        // }
        ListEmptyComponent={() => (
          <Center flex={1} h="$96">
            <Text color="$gray100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          </Center>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
