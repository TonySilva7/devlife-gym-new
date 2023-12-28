import { Image, IImageProps } from 'native-base'

type Props = IImageProps & {
  size: number
}

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      alt="User Photo"
      w={size}
      h={size}
      rounded="full"
      borderWidth={2}
      borderColor="gray.400"
      {...rest}
    />
  )
}
