import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import { ACTION_SLIDE_OPEN } from '../Redux/NavigationRedux';
import { EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_LOGIN, EMPTY_FIRST_NAME, EMPTY_LAST_NAME, EMPTY_CONFIRM_PASSWORD, ERROR_SIGNUP, EMPTY_ZIPCODE, PASSWORD_MISMATCH, WEAK_PASSWORD, PASSWORD_INCORRECT,SUCCESS_VERIFY } from '../Constants/constants.js'

// attempts to login
export function * login (api, data) {
  data = data.data
  if (data.email === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure(EMPTY_EMAIL))
  } else if (data.password === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure(EMPTY_PASSWORD))
  } else {
    // dispatch successful logins
    const response = yield call(api.login, data.email, data.password)
    if (response.status) {
      const {user} = response;
      // do data conversion here if needed
      yield put(LoginActions.loginSuccess(user))
      yield put({type:ACTION_SLIDE_OPEN})
    } else {
      yield put(LoginActions.loginFailure(ERROR_LOGIN, response.message))
    }
  }
}

export function * verify (api, data) {
  data = data.data
  if (data === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure(EMPTY_PASSWORD))
  } else {
    // dispatch successful logins
    const response = yield call(api.verify, data)
    if (response.status) {
      // do data conversion here if needed
      yield put(LoginActions.verifySuccess(SUCCESS_VERIFY))
    } else {
      yield put(LoginActions.loginFailure(ERROR_LOGIN, response.message))
    }
  }
}

export function * getUserInfo (api) {
  const response = yield call(api.getUserInfo)
  if (response.status) {
    const {userinfo} = response;
    // do data conversion here if needed
    yield put(LoginActions.success_userinfo(userinfo))
  } else {
    
  }
}

export function * forgotPassword (api, data) {
  data = data.data
  if (data.email === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure(EMPTY_EMAIL))
  } else {
    // dispatch successful logins
    const response = yield call(api.forgotPassword, data.email)
    if (response.status) {
      const {email} = response;
      // do data conversion here if needed
      yield put(LoginActions.success_forgotpassword(email))
    } else {
      yield put(LoginActions.loginFailure(ERROR_LOGIN, response.message))
    }
  }
}

export function * logout (api) {
  yield call(api.logout)
}

export function * updateUser (api, data) {
  data = data.data
  if (data.firstname === '') {
    // dispatch failure
    yield put(LoginActions.updateUserFailure(EMPTY_FIRST_NAME))
  }
  else if (data.lastname === '') {
    // dispatch failure
    yield put(LoginActions.updateUserFailure(EMPTY_LAST_NAME))
  }
  else if (data.email === '') {
    // dispatch failure
    yield put(LoginActions.updateUserFailure(EMPTY_EMAIL))
  } else if (data.zipcode === '') {
    // dispatch failure
    yield put(LoginActions.updateUserFailure(EMPTY_ZIPCODE))
  } else {
    let response = {};
    let str = data.image;
    if(typeof str === 'object'){
      let uri = str.uri;
      if(uri==''){
        data.image = '';
        response = yield call(api.updateUser, data);
      }
      else if(uri.startsWith('http')){
        data.image = uri;
        response = yield call(api.updateUser, data);
      }
      else{
        response = yield call(api.saveImage, uri)
        if(response.status){
          data.image = response.image;
          response = yield call(api.updateUser, data);
        }
      }
    }
    else{
      data.image = '';
      response = yield call(api.updateUser, data);
    }
  
    // dispatch successful
    if (response.status) {
      const {userId} = response;
      // do data conversion here if needed
      yield put(LoginActions.updateUserSuccess(userId))
    } else {
      yield put(LoginActions.updateUserFailure(ERROR_SIGNUP, response.message))
    }
  }
}
