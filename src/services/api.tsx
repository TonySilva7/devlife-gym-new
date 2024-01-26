/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormDataProps } from '@screens/Profile'
import { AppError } from '@utils/AppError'
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'

type ISignOut = () => void
type MyCallback = () => void

type PromiseType = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: ISignOut) => MyCallback
}

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 5000,
}) as APIInstanceProps

let failedQueued: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut: ISignOut) => {
  const interceptResponse = api.interceptors.response.use(
    // caso de sucesso
    (response: AxiosResponse) => response,

    // caso de erro
    async (error: any) => {
      if (error.response?.status === 401) {
        const isTokenError =
          error.response.data?.message === 'token.expired' ||
          error.response.data?.message === 'token.invalid'

        if (isTokenError) {
          const { refresh_token } = await storageAuthTokenGet()

          if (!refresh_token) {
            signOut()
            return Promise.reject(error)
          }

          const originalRequestConfig = error.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueued.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  }
                  resolve(api(originalRequestConfig))
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          return new Promise((resolve, reject) => {
            api
              .post('/sessions/refresh-token', { refresh_token })
              .then(async ({ data }) => {
                const { token, refresh_token } = data
                await storageAuthTokenSave({ token, refresh_token })

                // converte o data de string (row) para objeto
                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig.data,
                  )
                }

                originalRequestConfig.headers = {
                  Authorization: `Bearer ${token}`,
                }
                api.defaults.headers.common.Authorization = `Bearer ${token}`

                failedQueued.forEach((request) => {
                  request.onSuccess(token)
                })

                console.log('TOKEN ATUALIZADO')

                resolve(api(originalRequestConfig))
              })
              .catch((error) => {
                console.log(error)

                failedQueued.forEach((request) => {
                  request.onFailure(error)
                })

                signOut()
                reject(error)
              })
              .finally(() => {
                isRefreshing = false
                failedQueued = []
              })
          })
        }

        signOut()
      }

      if (error.response && error.response.data) {
        return Promise.reject(
          new AppError(error.response.data.message, error.response.status),
        )
      }

      return Promise.reject(error)
    },
  )

  const interceptRequest = api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // config.headers.Authorization = 'Bearer your_token_here'
      config.headers['Content-Type'] = 'application/json'
      config.headers.Accept = 'application/json'
      return config
    },
  )

  return () => {
    api.interceptors.response.eject(interceptResponse)
    api.interceptors.request.eject(interceptRequest)
  }
}

const userService = {
  getUsers: async (): Promise<AxiosResponse> => {
    const response = await api.get('/users')
    return response
  },
  getUserById: async (id: string): Promise<AxiosResponse> => {
    const response = await api.get(`/users/${id}`)
    return response
  },
  createUser: async (data: {
    name: string
    email: string
    password: string
  }): Promise<AxiosResponse> => {
    const response = await api.post('/users', data)
    return response
  },
  updateUserData: async (data: FormDataProps): Promise<AxiosResponse> => {
    const response = await api.put('/users', data)
    return response
  },
  updateImageProfile: async (data: FormData): Promise<AxiosResponse> => {
    console.log('Data: ', data)

    const response = await api.patch('/users/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },
  sigIn: async (data: {
    email: string
    password: string
  }): Promise<AxiosResponse> => {
    const response = await api.post('/sessions', data)
    return response
  },
}

const exerciseService = {
  getExercisesByGroup: async (
    groupSelected: string,
  ): Promise<AxiosResponse> => {
    const response = await api.get(`/exercises/bygroup/${groupSelected}`)

    return response
  },
  getGroups: async (): Promise<AxiosResponse> => {
    const response = await api.get('/groups')
    return response
  },
  getExerciseById: async (exerciseId: string): Promise<AxiosResponse> => {
    const response = await api.get(`/exercises/${exerciseId}`)
    return response
  },
  saveHistory: async (exerciseId: string): Promise<AxiosResponse> => {
    const response = await api.post('/history', { exercise_id: exerciseId })
    return response
  },
  getHistory: async (): Promise<AxiosResponse> => {
    const response = await api.get('/history')

    return response
  },
}

export const utilsService = {
  isAxiosError: axios.isAxiosError,
}

export { userService, exerciseService }
