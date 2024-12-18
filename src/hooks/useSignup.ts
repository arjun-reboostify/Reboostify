import { UserContext } from '../contexts/UserContext'
//hooks
import { useState } from 'react'
import { useContext } from 'react'
import { useErrorPromptContext } from './useErrorPromptContext'
//utils

import { getErrorMessage } from '../utils/getErrorMessage'
//firebase
import { auth } from '../contexts/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'


export const useSignup = () => {
  const { dispatch } = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { setIsError } = useErrorPromptContext()

  const signup = (email: string, password: string) => {
    setErrorMessage(null)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch({ type: 'LOGIN', payload: userCredential.user })
       
      })
      .catch((err) => {
        const message = getErrorMessage(err.code)
        setErrorMessage(message)
        !message && setIsError(true)
        // displays error message when user passes wrong email/password, every other auth error fires ErrorPrompt
      })
  }

  return { errorMessage, signup }
}
