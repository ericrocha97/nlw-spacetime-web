import axios from 'axios'

//comentario
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
