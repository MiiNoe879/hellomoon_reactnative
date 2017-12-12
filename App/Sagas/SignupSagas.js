import { call, put } from 'redux-saga/effects'
import SignupActions from '../Redux/SignupRedux'
import { ACTION_SLIDE_OPEN } from '../Redux/NavigationRedux';
import { EMPTY_FIRST_NAME, EMPTY_LAST_NAME, EMPTY_EMAIL, EMPTY_PASSWORD, EMPTY_CONFIRM_PASSWORD, ERROR_SIGNUP, EMPTY_ZIPCODE, PASSWORD_MISMATCH, WEAK_PASSWORD } from '../Constants/constants.js'

// attempts to login
export function * signup (api, data) {
  data = data.data
  if (data.firstname === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_FIRST_NAME))
  }
  else if (data.lastname === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_LAST_NAME))
  }
  else if (data.email === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_EMAIL))
  } else if (data.password === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_PASSWORD))
  } else if (data.confirmpassword === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_CONFIRM_PASSWORD))
  } else if (data.confirmpassword != data.password) {
    // dispatch failure
    yield put(SignupActions.signupFailure(PASSWORD_MISMATCH))
  } else if (data.zipcode === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure(EMPTY_ZIPCODE))
  } else {
    // dispatch successful signup
    const response = yield call(api.signup, data.email, data.password, data.zipcode, data.firstname, data.lastname)
    if (response.status) {
      const {user} = response;
      // do data conversion here if needed
      yield put(SignupActions.signupSuccess(user))
      yield put({type:ACTION_SLIDE_OPEN})
    } else {
      yield put(SignupActions.signupFailure(ERROR_SIGNUP, response.message))
    }
  }
}
