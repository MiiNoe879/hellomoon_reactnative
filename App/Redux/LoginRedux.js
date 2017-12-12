import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['data'],
  verifyRequest: ['data'],
  loginSuccess: ['email'],
  verifySuccess: ['error'],
  loginFailure: ['error', 'message'],
  updateUserSuccess: ['userid'],
  updateUserFailure: ['error', 'message'],
  userInfoRequest: null,
  forgotPasswordRequest: ['data'],
  success_forgotpassword: ['email'],
  success_userinfo: ['userinfo'],
  logout: null,
  init: null,
  updateUser: ['data'],
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  email: null,
  password: null,
  error: "error",
  fetching: false,
  loggedIn: false,
  verified: false,
  userinfo: '',
  message: ''
})

/* ------------- Reducers ------------- */

// we're attempting to login
//export const request = (state) => state.merge({ fetching: true });
export const request = (state ,{data}) => state.merge({ fetching: true, email: data.email, password: data.password })
export const user_request = (state) => state.merge({ fetching: true })
export const verify_request = (state) => state.merge({ fetching: true, verified: false })
export const forgotpassword_request = (state) => state.merge({ fetching: true })
export const update_user = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { email }) =>
  state.merge({ fetching: false, error: null, email: email, loggedIn: true })

export const success_userinfo = (state, { userinfo }) =>
state.merge({ fetching: false, error: null, userinfo: userinfo })

export const verifySuccess = (state, { error }) =>
state.merge({ fetching: false, error, verified: true })

export const updateUser = (state, { userinfo }) =>
state.merge({ fetching: true, error: 'error' })

export const updateUserSuccess = (state, { userId }) =>
state.merge({ fetching: false, error: null, userId: userId })

export const success_forgotpassword = (state, { email }) =>
state.merge({ fetching: false, error: null, message: email })

// we've had a problem logging in
export const failure = (state, { error, message }) =>
  state.merge({ fetching: false, error, message, verified: false })

export const updateUserFailure = (state, { error, message }) =>
   state.merge({ fetching: false, error, message })

// we've logged out
export const logout = (state) => INITIAL_STATE

export const init = (state) => state.merge({ fetching: false, error: 'error' })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.VERIFY_REQUEST]: verify_request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.VERIFY_SUCCESS]: verifySuccess,
  [Types.LOGIN_FAILURE]: failure,
  [Types.USERINFO_REQUEST]: user_request,
  [Types.SUCCESS_USERINFO]: success_userinfo,
  [Types.FORGOT_PASSWORD_REQUEST]: forgotpassword_request,
  [Types.SUCCESS_FORGOTPASSWORD]: success_forgotpassword,
  [Types.LOGOUT]: logout,
  [Types.INIT]: init,
  [Types.UPDATE_USER]: updateUser,
  [Types.UPDATE_USER_SUCCESS]: updateUserSuccess,
  [Types.UPDATE_USER_FAILURE]: updateUserFailure,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState) => loginState.email !== null
