import { Image } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type IUserPhoto = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: IUserPhoto) {
  return (
    <Image
      alt="User Photo"
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray100"
      {...rest}
    />
  )
}
