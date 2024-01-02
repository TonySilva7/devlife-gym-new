import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { styled, useToken } from '@gluestack-ui/themed'

const SkeletonContainer = styled(Animated.View, {
  height: '$20',
  width: '$20',
  borderRadius: '$full',
})

const Skeleton = () => {
  const green700 = useToken('colors', 'green700')
  const green800 = useToken('colors', 'green800')

  const animation = useRef(new Animated.Value(0)).current
  const colorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [green700, green800],
  })

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          useNativeDriver: false,
          duration: 700,
        }),
        Animated.timing(animation, {
          toValue: 0,
          useNativeDriver: false,
          duration: 700,
        }),
      ]),
    ).start()

    return () => {
      animation.stopAnimation()
    }
  }, [animation])

  return <SkeletonContainer style={{ backgroundColor: colorInterpolation }} />
}

export { Skeleton }
