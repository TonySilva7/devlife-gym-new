import { Pressable, Text } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof Pressable> & {
  name: string
  isActive: boolean
}

export function Group({ name, isActive, ...rest }: Props) {
  return (
    <Pressable
      mr="$3"
      w="$24"
      h="$10"
      bg="$gray600"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      borderColor="$green600"
      borderWidth={isActive ? 1 : 0}
      $pressed={{
        borderColor: '$green500',
        borderWidth: 1,
      }}
      {...rest}
    >
      <Text
        color={isActive ? '$green500' : '$gray200'}
        textTransform="uppercase"
        fontSize="$sm"
        fontWeight="bold"
      >
        {name}
      </Text>
    </Pressable>
  )
}
