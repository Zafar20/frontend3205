import { FormEvent, useState } from 'react'
import axios from 'axios'

interface IErrorResponse {
  message: string; 
}

export interface IUser  {
  email: string;
  number: string;
}

export type Event = FormEvent<HTMLFormElement>

export const useAllLogic = () => {
  const [users, setUsers] = useState<IUser[] | null>(null)
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('');
  const [responseError, setReponseError] = useState('');
  const [cancelTokenSource, setCancelTokenSource] = useState(axios.CancelToken.source());


  const resetFn = () => {
    setEmail('')
    setNumber('')
    setIsLoading(true)
    setReponseError('')
  }

  const preventFn = (e:Event) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Поле email обязательно для заполнения');
      return;
    }else {
      setEmailError('');
    }
  }



  const errorFn = (error: unknown) => {
    setUsers(null)
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as IErrorResponse; // Явное утверждение типа

      if (errorResponse) {
        setReponseError(errorResponse.message);
      } else {
        console.error('Error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }

    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    }
  }

  return {
      resetFn, 
      preventFn, 
      errorFn,
      setUsers,
      setEmail,
      setNumber,
      setIsLoading,
      setCancelTokenSource,
      users, 
      email,
      number, 
      isLoading, 
      emailError, 
      responseError, 
      cancelTokenSource 
  }

}