import { useState } from 'react'
import { Heading, VStack, SectionList, Text } from '@gluestack-ui/themed'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'

type IExercise = {
  id: string
  title: string
  data: string[]
}

export function History() {
  const [exercises, setExercises] = useState<IExercise[]>([
    {
      id: '123',
      title: '26.08.22',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      id: '234',
      title: '27.08.22',
      data: ['Puxada frontal'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList
        sections={exercises}
        keyExtractor={(item, index) => `${(item as IExercise).id}__${index}`}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {(section as IExercise).title}
          </Heading>
        )}
        px="$8"
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
