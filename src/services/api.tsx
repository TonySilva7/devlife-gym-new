/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '@utils/AppError'
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 5000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // config.headers.Authorization = 'Bearer your_token_here'
  config.headers['Content-Type'] = 'application/json'
  config.headers.Accept = 'application/json'
  return config
})

// Add response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: any) => {
    if (axios.isAxiosError(error) && error.response?.data.message) {
      return Promise.reject(
        new AppError(error.response.data.message, error.response.status),
      )
    }

    return Promise.reject(error)
  },
)

// Define your service methods
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
}

export const utilsService = {
  isAxiosError: axios.isAxiosError,
}

export { userService, exerciseService }
