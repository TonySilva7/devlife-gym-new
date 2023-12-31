import { Button as ButtonNativeBase, Text } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof ButtonNativeBase> & {
  title: string
  variant?: 'solid' | 'outline'
}

export function Button({ title, variant = 'solid', ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="$full"
      h="$12"
      bg={variant === 'outline' ? 'transparent' : '$green700'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="$green500"
      rounded="$sm"
      $pressed={{
        bg: variant === 'outline' ? '$gray500' : '$green500',
      }}
      {...rest}
    >
      <Text
        color={variant === 'outline' ? '$green500' : '$white'}
        // fontFamily="$heading"
        fontSize="$sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  )
}
