import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signupRequest: ['data'],
  signupSuccess: ['email'],
  signupFailure: ['error','message'],
  logout: null
})

export const SignupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  firstname: null,
  lastname: null,
  email: null,
  password: null,
  error: "error",
  fetching: false,
  zipcode: false,
  phone: '',
  message: ''
})

/* ------------- Reducers ------------- */

// we're attempting to signup
export const request = (state) => state.merge({ fetching: true })

// we've successfully signup uup
export const success = (state, { email }) =>
  state.merge({ fetching: false, error: null, email: email })

// we've had a problem sign up
export const failure = (state, { error, message }) =>
   state.merge({ fetching: false, error, message })

export const logout = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

