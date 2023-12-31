import { FlatList, Heading, HStack, Text, VStack } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

export function Home() {
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'ombro'])
  const [exercises, setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento terras',
  ])
  const [groupSelected, setGroupSelected] = useState('Costas')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

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
          keyExtractor={(item) => item as string}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </VStack>
    </VStack>
  )
}
