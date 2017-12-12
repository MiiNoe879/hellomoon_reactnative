import apisauce from 'apisauce'
import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'
import Geocoder from 'react-native-geocoding';
import GeoFire from 'geofire';
import { Platform } from 'react-native'

// our "constructor"
const create = (baseURL = 'https://api.github.com/') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  
  //const getRoot = () => api.get('')
  //const getRate = () => api.get('rate_limit')
  //const getUser = (username) => api.get('search/users', {q: username})
  const shops=[
    {id:0, name:'Individual Medley', distance:1},
    {id:1, name:'Crystal Matrix', distance:1.5},
    {id:2, name:'Mattress Central', distance:2},
    {id:3, name:'Atwater Christian Bookstore', distance:2.5},
    {id:4, name:'Out of the Closet - Atwater', distance:3},
    {id:5, name:'Speedco Fax and Pack', distance:4},
    {id:6, name:'John Gaughan & Associates', distance:7},
    {id:7, name:'RepoKar', distance:10}
  ]

  const response ={
    ok:true,
    shops
  }  
  const getShopList = (search) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/shops').once('value')
      .then(function(snapshot) {
        if(search !== ''){
          search = search.toLowerCase();
          let items = snapshot.val();
          let keys = Object.keys(items);
          let results = [];
          for(let key of keys) {
            let name = items[key].data.name;
            name = name.toLowerCase();
            if( name.indexOf(search) !== -1){
              results[key]=items[key];
            }
          }
          return resolve({status: true, shops: results});
        }
        else {
          return resolve({status: true, shops: snapshot.val()});
        }
      })
      .catch((error) => {
        console.log(error)
        return resolve({status: false, message: error.message});
      });
    })
  }

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        return resolve({status: true, user: email}) 
      })
      .catch((error) => {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const verify = (password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, password))
      .then(() => {
        return resolve({status: true}) 
      })
      .catch((error) => {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const getUserInfo = () => {
    var userId = firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      firebase.database().ref('/users/' + userId).once('value')
      .then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var firstname = (snapshot.val() && snapshot.val().firstname) || 'Anonymous';
        var lastname = (snapshot.val() && snapshot.val().lastname) || 'Anonymous';
        var userrole = (snapshot.val() && snapshot.val().role) || '0';
        var zipcode = (snapshot.val() && snapshot.val().zipcode) || '';
        var phone = (snapshot.val() && snapshot.val().phone) || '';
        var gender = (snapshot.val() && snapshot.val().gender) || '';
        var image = (snapshot.val() && snapshot.val().image) || '';
        return resolve({status: true, userinfo: {name: username, role: userrole, zipcode: zipcode, firstname: firstname, lastname: lastname, gender: gender, phone: phone, image: image}}) 
      })
      .catch((error) => {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const signup = (email, password, zipcode, firstname, lastname) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var uid = user.uid;
            var email = user.email;
            // Get a reference to the database service
            var database = firebase.database();
            firebase.database().ref('users/' + uid).set({
              email: email,
              zipcode: zipcode,
              role: 1,
              firstname: firstname,
              lastname: lastname
            });
          } else {
          }
        }); 
        return resolve({status: true, user: email}) 
      })
      .catch((error) => {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const updateUser = (data) => {
    var userId = firebase.auth().currentUser.uid;
    if(data.newpassword !== ''){
      var user = firebase.auth().currentUser;
      return new Promise((resolve, reject) => {
          user.updatePassword(data.newpassword).then(function() {
          firebase.database().ref('users/' + userId).set({
            zipcode: data.zipcode,
            firstname: data.firstname,
            lastname: data.lastname,
            gender: data.gender,
            phone: data.phone,
            image: data.image,
            role: data.role,
          }).then(function(){
            return resolve({status: true, userId: userId});
          }).catch(function(error) {
            return resolve({status: false, message: error.message})
          });
        }).catch(function(error) {
          return resolve({status: false, message: error.message})
        });
      });
    }

    return new Promise((resolve, reject) => {
      firebase.database().ref('users/' + userId).set({
        zipcode: data.zipcode,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        phone: data.phone,
        image: data.image,
        role: data.role,
      }).then(function(){
        return resolve({status: true, userId: userId});
      }).catch(function(error) {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const forgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      var auth = firebase.auth();
      auth.sendPasswordResetEmail(email).then(function() {
        return resolve({status: true, email: email}) 
      }).catch(function(error) {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const saveShop = (data) => {
    return new Promise((resolve, reject) => {
      var d = new Date();
      var dataid = d.getTime();
      firebase.database().ref('shops/' + dataid).set({
        data
      }).then(function(){
        return resolve({status: true, id: dataid});
      }).catch(function(error) {
        return resolve({status: false, message: error.message})
      });
    });
  }
  
  const uploadImage = (uri, mime = 'application/octet-stream') => {
    const storage = firebase.storage()
    // Prepare Blob support
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const sessionId = new Date().getTime()
      let uploadBlob = null
      const imageRef = storage.ref('images').child(`${sessionId}`)
  
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }

  const saveImage = (data) => {
    const uri = data;
    return new Promise((resolve, reject) => {
      uploadImage(uri)
        .then(url => {
          return resolve({status: true, image: url});
        })
        .catch(error =>{
           return resolve({status: false, message: error});
        })
    });
  }

  const updateShop = (data, shopId) => {
    if(shopId){
      return new Promise((resolve, reject) => {
        firebase.database().ref('shops/' + shopId).set({
          data
        }).then(function(){
          return resolve({status: true, id: shopId});
        }).catch(function(error) {
          return resolve({status: false, message: error.message})
        });
      });
    }
    else
      return new Promise((resolve, reject) => {
        return resolve({status: false, message: 'Save failure'})
      });
  }
  
  const getShopinfo = (shopId) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/shops/' + shopId).once('value')
      .then(function(snapshot) {
        return resolve({status: true, shopinfo: snapshot.val()}) 
      })
      .catch((error) => {
        return resolve({status: false, message: error.message})
      });
    })
  }

  const fetchInstagram = () => api.get('')

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return resolve({status: true, position: position})
        },
        (error) => { return resolve({status: false, message: error.message}) },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });
  }

  const getDistance = (data) => {
    const current = data[0];
    const dest = data[1];
    return new Promise((resolve, reject) => {
      Geocoder.getFromLocation(dest).then(
        json => {
            let location = json.results[0].geometry.location;
            //location.lat location.lng
            let distance = geolib.getDistance(current.position.coords, location);
            distance = distance/1609.344;
            distance = distance.toFixed(2);
            return resolve({status: true, distance: distance})
        },
        error => {
          return resolve({status: false})
        }
      );
    });
  }

  const logout = () => {
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
    });
  }


  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    /*getRoot,
    getRate,
    getUser,*/
    getShopList,
    login,
    getUserInfo,
    signup,
    logout,
    forgotPassword,
    saveShop,
    saveImage,
    updateShop,
    getShopinfo,
    getCurrentLocation,
    getDistance,
    fetchInstagram,
    updateUser,
    verify,
  }
}

// let's return back our create method as the default.
export default {
  create
}
