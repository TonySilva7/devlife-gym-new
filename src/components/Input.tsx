import {
  AlertCircleIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputField,
  InputIcon,
  InputSlot,
  Input as NativeBaseInput,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isDisabled?: boolean
  Icon?: React.ComponentType
}

export function Input({
  Icon,
  errorMessage = null,
  isInvalid,
  isDisabled,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid}>
      <NativeBaseInput
        isInvalid={isInvalid}
        $focus={{
          borderWidth: 1,
          borderColor: '$green500',
        }}
        $invalid={{
          borderWidth: 1,
          borderColor: '$red500',
        }}
        w="$full"
        borderWidth="$0"
        borderRadius="$md"
        minHeight="$12"
        px="$2"
        isDisabled={isDisabled}
        bg="$gray600"
      >
        {!!Icon && (
          <InputSlot>
            <InputIcon color="$gray200" as={Icon} />
          </InputSlot>
        )}

        <InputField w="$full" h="$full" color="white" {...rest} />
      </NativeBaseInput>

      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText color="$error700">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
