import React,{Component} from 'react';
import {Image,ScrollView, ImageBackground, Modal, TouchableOpacity} from 'react-native';
import {Content, List, ListItem, Text, View, Container, Header, Title, Button, Left, Right, Body, Icon, H3} from "native-base";
import {Card, CardItem, Thumbnail} from 'native-base';
import {InfiniteListView} from '../../Components/InfiniteListView';

import {RefreshControl, Platform, Dimensions} from 'react-native';

import {connect} from 'react-redux';
import ShopActions from "../../Redux/ShopRedux";
import LinearGradient from 'react-native-linear-gradient';

import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import ImageLoad from '../../Components/ImageLoad/ImageLoad';
import Search from '../Search/SearchScreen';

import { connectStyle } from 'native-base';

console.disableYellowBox = true;

class HomeScreen extends Component{
  state = {
    isRefreshing: this.props.shops.fetching,
    isLoadingMore: false,
    canLoadMoreContent: false,
    listItems: [],
    modalSearchVisible: false,
  }

  componentDidMount () {
    const { search } = this.props.shops;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList(search, position.coords.latitude, position.coords.longitude);
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onClearSearch() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList('', position.coords.latitude, position.coords.longitude);
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  componentWillReceiveProps(nextProps) {
    const nears = this.props.shops.nears;
    const next_nears = nextProps.shops.nears;
    if(nears.length != next_nears.length){
      this.props.getShopList(next_nears);
    }
  }

  componentWillMount() {
  }

  setModalVisible(visible) {
		this.setState({modalSearchVisible: visible});
	}

	setModalSearchVisible(visible) {
		this.setState({modalSearchVisible: visible});
	}
	
	onSearch() {
		this.modalSearchVisible(false);
  }
  
  onCloseSearchModal(gotoMap) {
    this.setModalVisible(false);
    if(gotoMap==1){
      this.props.navigation.navigate('Map');
    }
	}
  
  onRefresh = () => {
    const { search } = this.props.shops;
    //this.props.refreshShopList(search);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList(search, position.coords.latitude, position.coords.longitude);
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  onLoadMore = () => {
  };

  renderRow = (rowData, sectionID, rowID) => {
    let imageSrc = '';
    if(rowData.shopImage){
      imageSrc = rowData.shopImage;
      imageSrc = { uri: imageSrc+'' };
    }
    else
      imageSrc = require('../../Resources/Images/background.png');
    return (
      <ListItem
        icon
        key={rowData.id}
        style={styles.listItem}
        //onPress={() => this.props.navigation.navigate("NavigationShopDetailTab")}
        onPress={() => this.props.gotoDetailShop(rowData.id)}
      >
        <Body>
          <ImageLoad 
            source={imageSrc}
            loadingStyle={{ size: 'small', color: 'grey' }}
            placeholderSource={require('../../Resources/Images/background.png')}
            placeholderStyle={styles.shopimage}
            style={{width: width,height: height/3}}
            imageStyle={{resizeMode: 'stretch'}}
          >
            <View style={styles.itembody}>
              {/* <View style={styles.carticon}>
                <Icon name="cart"/>
              </View> */}
              <View style={styles.shopinfo}>
                <Text style={styles.itemtext}>{rowData.name}</Text>
                <View style={styles.whiteborder}>
                </View>
                <View style={styles.locationinfo}>
                  <IconEvilIcons name='location' style={styles.locationicon} />
                  <Text style={styles.locationtxt}>{rowData.distance} miles</Text>
                </View>
              </View>
            </View>
          </ImageLoad>
        </Body>
        <Right style={styles.listitemicon}>
            <Icon name="arrow-forward" style={{color: 'white'}}/>
        </Right>
      </ListItem>
    );
  };
  
  render(){
    let {shops,search} = this.props.shops;
    const {fetching} = this.props.shops.fetching;
    search = search.toLowerCase();
    let result = [];
    for(let shop of shops){
      let shopname = shop.name;
      shopname = shopname.toLowerCase();
      if( shopname.indexOf(search) !== -1 ) {
        result.push(shop);
      }
    }

    return(
      <Container style={{backgroundColor:'#2e2d2e'}}>            
        <LinearGradient colors={['#2e2d2e','#434343','#4d4d4d']} style={styles.headerStyle}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                <Icon name="md-menu" style={{backgroundColor:'transparent', color:'white'}}/>
              </Button>
            </Left>            
            <View style={{flexDirection:'row', justifyContent:'flex-start', flexDirection:'row'}}>
              <Button transparent style={styles.btnmenu}>
                <Image source={require('../../Resources/Images/list.png')} style={styles.listicon}/>
              </Button>
              <Button transparent style={styles.btnmenu} onPress={() => this.props.navigation.navigate("Search")}>
                <Icon name='ios-search' style={styles.searchicon}/>
              </Button>
              <Button transparent style={styles.btnmenu} onPress={() => this.props.navigation.navigate("Map")}>
                <IconEvilIcons name='location' style={styles.locationicon}/>
              </Button>
            </View>
        </LinearGradient>
        <Content style={styles.content} scrollEnabled={false}>
          {
            (search) ?
              (<View style={{flexDirection: 'row', justifyContent: 'space-between', height: 30, backgroundColor: 'yellow', paddingLeft: 10, paddingRight: 10}}>
                <Button transparent onPress={()=>this.props.navigation.navigate("Search")} style={{height: 30, width: 0.8*width}}>
                  <Text style={{color: 'black'}}>Shop: {search}</Text>
                </Button>
                <Button transparent onPress={()=>this.onClearSearch()} style={{height: 30}}>
                  <Icon name='ios-close' style={{color: '#44b1c2', fontSize: 30}} />
                </Button>
              </View>) :
              (<View></View>)
          }
          <View style={styles.refreshview}><Image source={require('../../Resources/Images/refresh.png')} style={styles.refreshimage}/></View>
          <InfiniteListView
            style={styles.listview}
            dataArray={(search) ? result : shops}
            renderRow={this.renderRow}
            onRefresh={this.onRefresh}
            isRefreshing={this.state.isRefreshing}
            canLoadMore={this.canLoadMoreContent}
            isLoadingMore={this.state.isLoadingMore}
            onLoadMore={this.onLoadMore}
          />
        </Content>
        <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle}/>
        <Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalSearchVisible}
          onRequestClose={() => {}}
          onClose={() => this.onCloseSearchModal()}
				>
					<Search onClose={(gotoMap) => {this.onCloseSearchModal(gotoMap)}} onSearch={() => {this.onSearch()}}/>
				</Modal>
      </Container>
      )
  }
}
const mapStateToProps = state => {
  return {
    shops:state.shops
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshShopList: (search, lat, lng) => dispatch(ShopActions.refreshRequest(search, lat, lng)),
    getShopList: (shops) => dispatch(ShopActions.getShopsRequest(shops)),
    gotoDetailShop: (shopId) =>{ 
      dispatch(ShopActions.gotoDetailShop(shopId));
    },
  };
};

const {width, height} = Dimensions.get('window');
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)
const containerHeight = height-toolBarHeight;

const styles = {
  headerStyle:{
    height:toolBarHeight,
    paddingTop: Platform.OS === "ios" ? 15 : 0,
    flexDirection:'row',
    alignItems:'center'
  },
  contentContainer:{
    height:height
  },
  bottomOverStyle:{
    position:'absolute',    
    height:toolBarHeight,
    bottom:0,left:0,right:0,    
  },
  searchicon: {
    color: '#fff',
    fontSize: 25
  },
  locationicon: {
		color: '#fff',
		fontSize: 30
  },
  listicon: {
    width: 30,
    height: 30
  },
  btnmenu: {
    paddingHorizontal:2,
    paddingLeft: 5,
    paddingRight: 5
  },
  content: {
		backgroundColor: '#4d4d4d',
		flex: 1,
  },
  refreshview: {
		alignItems: 'center',
		position: 'absolute',
		top: 30,
		left: 0,
		right: 0,
		bottom: 0
	},
	refreshimage: {
    marginTop: 40,
		width: 46,
		height: 76
  },
  listview: {
    marginTop: 0,
    height: height
  },
  shopimage: {
    width: width,
    height: height/3,
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    resizeMode: 'stretch'
  },
  listItem: {
    height: height/3,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  listitemicon: {
    height: height/3,
    borderColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 10
  },
  carticon: {
    backgroundColor: 'yellow',
    borderRadius: 30,
    width: 50,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itembody: {
    height: height/3,
    width: width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemtext: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  whiteborder: {
    width: width*0.7,
    height: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed'
  },
  shopinfo: {
    marginTop: 10
  },
  locationinfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationicon: {
    color: '#fff',
    fontSize: 30
  },
  fillParent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  locationtxt: {
    color: 'white'
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
/*refreshControl={ <RefreshControl/> }*/
