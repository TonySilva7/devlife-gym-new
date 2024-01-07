import { ReactNode, createContext, useEffect, useState } from 'react'
import { api, userService } from '@services/api'
import { UserDTO } from '@dtos/UserDTO'
import { storageAuthTokenSave } from '@storage/storageAuthToken'

import {
  storageUserGet,
  storageUserSave,
  storageUserRemove,
} from '@storage/storageUser'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>

  isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function storageUserAndToken(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      await storageUserSave(userData)
      await storageAuthTokenSave(token)
      setUser(userData)
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await userService.sigIn({ email, password })

    if (data.user && data.token) {
      storageUserAndToken(data.user, data.token)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
      }
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
