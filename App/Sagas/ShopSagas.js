import { call, put, take } from 'redux-saga/effects'
import { eventChannel, delay, buffers } from 'redux-saga'
import { path } from 'ramda'
import ShopActions from '../Redux/ShopRedux'
import { ACTION_GOTO_DETAIL, ACTION_GOTO_EDIT } from '../Redux/NavigationRedux';
import { ERROR_SAVE, EMPTY_NAME, EMPTY_STREET, EMPTY_ZIPCODE, EMPTY_CITY, EMPTY_STATE, EMPTY_COUNTRY, EMPTY_PHONENUMBER, EMPTY_INSTAGRAM, EMPTY_OPEN, EMPTY_CLOSE, EMPTY_URL, ERROR_INSTAGRAM } from '../Constants/constants.js'
import AppAPI from '../Services/AppApi'
import GeoFire from 'geofire';
import firebase from 'firebase';

function subscribe(data, buffer) {
  const lat = data.lat;
  const lng = data.lng;
  var firebaseRef = firebase.database().ref('/geofire');
  var geoFire = new GeoFire(firebaseRef);
  
  var geoQuery = geoFire.query({
    //center: [34.074453, -118.27822],
    center: [Number(lat), Number(lng)],
    radius: 5*1.609
  });

  return eventChannel((emit) => {
    geoQuery.on(
      'key_entered',
      (id, location, distance) =>{
        distance /= 1.609;
        distance = distance.toFixed(2);
        emit(ShopActions.addNearMe({ id, distance, location }));
      },
    );
    return () => { geoQuery.cancel(); };
  }, buffer);
}

export function * getShopList (api, data) {
  const buffer = buffers.expanding();
  const channel = yield call(subscribe, data, buffer);
  
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function * refreshShops (api, data) {
  let shops = [];
  const items = data.shops;
  for(let item of items){
    let shopId = item.id;
    const response = yield call(api.getShopinfo, shopId)
    if (response.status) {
      const {shopinfo} = response;
      let shop = shopinfo.data;
      shop.id = shopId;
      shop.distance = item.distance;
      if(!shop.location){
        shop.location = {
          lat: item.location[0],
          lng: item.location[1]
        }
      }
      shops.push(shop);
    } else {
      shops.push(item);
    }
  }
  shops.sort(function(a,b){
    if(!a.distance){
      return -1;
    }
    if(a.distance<b.distance){
      return -1;
    }
    if(a.distance>b.distance){
      return 1;
    }
    return 0;
  });
  yield put(ShopActions.refreshSuccess(shops))
}

export function * getShopList_ (api, data) {
  const search = data.search;
  // make the call to the api
  const response = yield call(api.getShopList, search)
  if (response.status) {
    const {shops} = response;
    // do data conversion here if needed
    let listItems = [];
    for(let key in shops){
        let item = shops[key].data;
        item['id'] = key;
        listItems.push(item);
    }
    const locationinfo = yield call(api.getCurrentLocation);
    if(locationinfo.status){
      let results = [];
      for(let key in listItems){
          let item = listItems[key];
          let address = item.address;
          address = address.street+", "+address.city+", "+address.state+", "+address.country;
          const distanceinfo = yield call(api.getDistance,[locationinfo,address]);
          if(distanceinfo.status)
            item.distance = distanceinfo.distance;
          results.push(item);
      }
      results.sort(function(a,b){
        if(!a.distance){
          return -1;
        }
        if(a.distance<b.distance){
          return -1;
        }
        if(a.distance>b.distance){
          return 1;
        }
        return 0;
      });
      yield put(ShopActions.refreshSuccess(results))
    }
    else
      yield put(ShopActions.refreshSuccess(listItems))
  } else {
    const shops = [];
    yield put(ShopActions.refreshSuccess(shops))
  }
}

export function * saveShop (api, data) {
  const shopId = data.shopId;
  data = data.data;
  if (data.country === '') {
    yield put(ShopActions.failure(EMPTY_COUNTRY))
  }
  else if (data.name === '') {
    yield put(ShopActions.failure(EMPTY_NAME))
  } else if (data.address.street === '') {
    yield put(ShopActions.failure(EMPTY_STREET))
  } else if (data.address.zipcode === '') {
    yield put(ShopActions.failure(EMPTY_ZIPCODE))
  } else if (data.address.city === '') {
    yield put(ShopActions.failure(EMPTY_CITY))
  } else if (data.address.state === '') {
    yield put(ShopActions.failure(EMPTY_STATE))
  } else {
    let response={};
    if(shopId==0) {
      // make the call to the api
      if(data.shopImage === '')
        response = yield call(api.saveShop, data)
      else{
        let uri = data.shopImage.uri;
        response = yield call(api.saveImage, uri)
        if(response.status){
          data.shopImage = response.image;
          response = yield call(api.saveShop, data);
        }
      }
    } else {
      if(data.shopImage === '')
        response = yield call(api.updateShop, data, shopId)
      else {
        let str = data.shopImage;
        if(typeof str === 'object'){
          console.log(str)
          let uri = str.uri;
          if(uri==''){
            data.shopImage = '';
            response = yield call(api.updateShop, data, shopId);
          }
          else if(uri.startsWith('http')){
            data.shopImage = uri;
            response = yield call(api.updateShop, data, shopId);
          }
          else{
            response = yield call(api.saveImage, uri)
            if(response.status){
              data.shopImage = response.image;
              response = yield call(api.updateShop, data, shopId);
            }
          }
        }
        else{
          response = yield call(api.updateShop, data, shopId);
        }
      }
    }
    if (response.status) {
      // do data conversion here if needed
      yield put(ShopActions.saveShopSuccess(response.id))
      yield put({type:ACTION_GOTO_DETAIL})
    } else {
      yield put(ShopActions.failure(ERROR_SAVE, response.message))
    }
  }
}

export function * saveImage (api, data) {
  data = data.image;
  let response = yield call(api.saveImage, data.uri)
  if (response.status) {
    // do data conversion here if needed
    yield put(ShopActions.saveImageSuccess(response.image))
  } else {
    yield put(ShopActions.failure(ERROR_SAVE, response.message))
  }
}

export function * getShopinfo (api, data) {
  let shopId = data.id;
  const response = yield call(api.getShopinfo, shopId)
  if (response.status) {
    const {shopinfo} = response;
    // do data conversion here if needed
    if(shopinfo)
      yield put(ShopActions.successShopinfo(shopinfo))
    else
      yield put(ShopActions.failure(ERROR_SAVE, ''))
  } else {
    yield put(ShopActions.failure(ERROR_SAVE, ''))
  }
}

export function * instagramFetchRequest(data) {
  let instagramId = data.instagramId;
  let max_id = data.max_id;
  let url = 'https://www.instagram.com/'+data.instagramId+'/?__a=1';
  if(max_id)
    url = 'https://www.instagram.com/'+data.instagramId+'/?__a=1&max_id='+max_id;
  let api = AppAPI.create(url);
  
  const response = yield call(api.fetchInstagram)
  if (response.status==200) {
    // do data conversion here if needed
    let instagram = { images: response.data.user.media.nodes, count: response.data.user.media.count, end_cursor: response.data.user.media.page_info.end_cursor, is_private: response.data.user.is_private };
    yield put(ShopActions.successInstagramFetch(instagram))
  } else {
    yield put(ShopActions.failureInstagram(ERROR_INSTAGRAM, ''))
  }
}

export function * gotoDetailShop () {
  yield put({type:ACTION_GOTO_DETAIL});
}

export function * gotoEditShop (shopId) {
  yield put({type:ACTION_GOTO_EDIT});
}