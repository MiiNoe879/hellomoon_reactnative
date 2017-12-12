import { takeLatest, all } from 'redux-saga/effects'
//import API from '../Services/Api'
import AppAPI from '../Services/AppApi'
//import FixtureAPI from '../Services/FixtureApi'
//import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

//import { StartupTypes } from '../Redux/StartupRedux'
//import { GithubTypes } from '../Redux/GithubRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { ShopTypes } from '../Redux/ShopRedux'
/* ------------- Sagas ------------- */

//import { startup } from './StartupSagas'
import { login, logout, getUserInfo, forgotPassword, updateUser, verify } from './LoginSagas'
import { signup } from './SignupSagas'
//import { getUserAvatar } from './GithubSagas'
import { getShopList, saveShop, getShopinfo, gotoDetailShop, gotoEditShop, saveImage, instagramFetchRequest, refreshShops } from './ShopSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
//const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const appApi = AppAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    //takeLatest(StartupTypes.STARTUP, startup),
    //takeLatest(LoginTypes.LOGIN_REQUEST, login),

    // some sagas receive extra parameters in addition to an action
    //takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
    takeLatest(LoginTypes.LOGIN_REQUEST, login, appApi),
    takeLatest(LoginTypes.VERIFY_REQUEST, verify, appApi),
    takeLatest(LoginTypes.LOGOUT, logout, appApi),
    takeLatest(LoginTypes.USER_INFO_REQUEST, getUserInfo, appApi),
    takeLatest(LoginTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, appApi),
    takeLatest(LoginTypes.UPDATE_USER, updateUser, appApi),
    takeLatest(SignupTypes.SIGNUP_REQUEST, signup, appApi),
    takeLatest(ShopTypes.REFRESH_REQUEST, getShopList, appApi),
    takeLatest(ShopTypes.GET_SHOPS_REQUEST, refreshShops, appApi),
    takeLatest(ShopTypes.SAVE_SHOP, saveShop, appApi),
    takeLatest(ShopTypes.SAVE_IMAGE, saveImage, appApi),
    takeLatest(ShopTypes.SHOP_INFO_REQUEST, getShopinfo, appApi),
    takeLatest(ShopTypes.GOTO_DETAIL_SHOP, gotoDetailShop),
    takeLatest(ShopTypes.GOTO_EDIT_SHOP, gotoEditShop),
    takeLatest(ShopTypes.INSTAGRAM_FETCH_REQUEST,instagramFetchRequest),
  ])
}
