import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  refreshRequest: ['search', 'lat', 'lng'],
  getShopsRequest: ['shops'],
  refreshSuccess: ['shops'],
  saveShop: ['data', 'shopId'],
  saveImage: ['image'],
  saveImageSuccess: ['url'],
  saveShopSuccess: ['id'],
  shopInfoRequest: ['id'],
  successShopinfo: ['shop'],
  failure: ['error', 'message'],
  failureInstagram: ['error', 'message'],
  init: null,
  setDistances: ['shops'],
  gotoDetailShop: ['shopId'],
  gotoEditShop: ['shopId'],
  updateShop: ['shop', 'shopId'],
  instagramFetchRequest: ['instagramId', 'max_id'],
  successInstagramFetch: ['instagram'],
  addNearMe: ['near'],
})

export const ShopTypes = Types
export default Creators

/* ------------- Initial State ------------- */
initialShops=[]
  
export const INITIAL_STATE = Immutable({
  shops: [],
  search: '',
  error: 'error',
  fetching: false,
  selectedShopId: 0,
  instagram: { count:0, images:{}, end_cursor: 0, is_private: -1 },
  shop: {
    name: '',
    address: {
        street: '',
        zipcode: '',
        city: '',
        state: '',
        country: 'United States',
    },
    cca2: 'US',
    hours: [
        {
            title: 'Sunday',
            open: '',
            close: ''
        },{
            title: 'Monday',
            open: '',
            close: ''
        },{
            title: 'Tuesday',
            open: '',
            close: ''
        },{
            title: 'Wednesday',
            open: '',
            close: ''
        },{
            title: 'Thursday',
            open: '',
            close: ''
        },{
            title: 'Friday',
            open: '',
            close: ''
        },{
            title: 'Saturday',
            open: '',
            close: ''
        }
    ],
    features: [
        {
            title: 'Pet Allowed',
            selected: false
        },{
            title: 'Credit Card Allowed',
            selected: false
        },{
            title: 'Indoor seating Available',
            selected: false
        },{
            title: 'Wifi Provided',
            selected: false
        },{
            title: 'Parking Available',
            selected: false
        },{
            title: 'Patio Available',
            selected: false
        },{
            title: 'Serving Take Flight',
            selected: false
        },
    ],
    phonenumber: '',
    instagram: [],
    url: '',
    shopImage: ''
  },
  nears: []
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state, {search}) => state.merge({ fetching: false, search: search, nears: [] })
export const getShopsRequest = (state) => state.merge({ fetching: true })
export const saveShop = (state, {data,shopId}) => state.merge({ fetching: true, selectedShopId: shopId })
export const saveImage = (state, {data}) => state.merge({ fetching: true })

export const success = (state, { shops }) =>{
    return state.merge({ fetching: false, error: null, shops })
}

export const success_init = (state, { shops }) =>{
  return state.merge({ fetching: false, error: null, shops })
}

export const saveShopSuccess = (state, {id}) =>{
  return state.merge({ fetching: false, error: null, selectedShopId : id })
}

export const saveImageSuccess = (state, {url}) =>{
    return state.merge({ fetching: false, error: null, image: url })
}

export const getShopinfo = (state, {id}) =>{
  if(id==0)
    return state.merge({ fetching: false, error: null, shops: INITIAL_STATE});
  return state.merge({ fetching: true })
}

export const successShopinfo = (state, {shop}) =>{
  if(shop)
    return state.merge({ fetching: false, error: null, shop: shop.data })
  else
    return state.merge({ fetching: false, error: null, shop: INITIAL_STATE })
}

export const instagramFetchRequest = (state, {instagramId, max_id}) =>{
    return state.merge({ fetching: true })
}

export const successInstagramFetch = (state, {instagram}) =>{
    if(instagram)
        return state.merge({ fetching: false, error: null, instagram: instagram })
    else
        return state.merge({ fetching: false, error: null, instagram: { count:0, images:{}, end_cursor: 0, is_private: -1 } })
}

export const failure = (state, { error }) =>
  state.merge({ fetching: false, error })

export const failureInstagram = (state, { error }) =>
  state.merge({ fetching: false, error, instagram: { count:0, images:{}, end_cursor: 0, is_private: -1 } })

export const init = (state) => INITIAL_STATE

export const setDistances = (state, { shops }) => {
    return state.merge({ fetching: false, error: null, shops })
}

export const gotoDetailShop = (state, {shopId}) =>{
    return state.merge({ fetching: false, error: null, selectedShopId : shopId })
}

export const gotoEditShop = (state, {shopId}) =>{
    return state.merge({ fetching: false, error: null, selectedShopId: shopId })
}

export const addNearMe = (state, {near}) => {
    let nears = Object.assign([], state.nears);
    nears.push(near);
    return state.merge({ error: null, nears:  nears})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REFRESH_REQUEST]: request,
  [Types.GET_SHOPS_REQUEST]: getShopsRequest,
  [Types.REFRESH_SUCCESS]: success,
  [Types.SAVE_SHOP]: saveShop,
  [Types.SAVE_IMAGE]: saveImage,
  [Types.SAVE_SHOP_SUCCESS]: saveShopSuccess,
  [Types.SAVE_IMAGE_SUCCESS]: saveImageSuccess,
  [Types.SHOP_INFO_REQUEST]: getShopinfo,
  [Types.SUCCESS_SHOPINFO]: successShopinfo,
  [Types.INSTAGRAM_FETCH_REQUEST]: instagramFetchRequest,
  [Types.SUCCESS_INSTAGRAM_FETCH]: successInstagramFetch,
  [Types.FAILURE]: failure,
  [Types.FAILURE_INSTAGRAM]: failureInstagram,
  [Types.INIT]: init,
  [Types.SET_DISTANCES]: setDistances,
  [Types.GOTO_DETAIL_SHOP]: gotoDetailShop,
  [Types.GOTO_EDIT_SHOP]: gotoEditShop,
  [Types.ADD_NEAR_ME]: addNearMe,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?