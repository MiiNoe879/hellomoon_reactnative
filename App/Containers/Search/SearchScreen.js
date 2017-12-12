import React,{Component} from 'react';
import {Image,ScrollView, ImageBackground, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import {Content, View, Container, Header, Footer, Title, Button, Left, Right, Body, Icon, Input, Item, ListItem} from "native-base";

import {RefreshControl, Platform, Dimensions, Keyboard} from 'react-native';

import {connect} from 'react-redux';
import ShopActions from "../../Redux/ShopRedux";
import LinearGradient from 'react-native-linear-gradient';
import IconIonic from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {InfiniteListView} from '../../Components/InfiniteListView';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';

const { width, height } = Dimensions.get('window');

import { connectStyle } from 'native-base';

class SearchScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      showSearch: false,
      isRefreshing: this.props.shops.fetching,
      isLoadingMore: false,
      canLoadMoreContent: false,
      shops: [],
      isAttempting: false
    }
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.showAround = this.showAround.bind(this);
  }

  componentDidMount () {
    this.setState({search: this.props.shops.search});
    this.onChangeText(this.props.shops.search);
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.setState({showSearch: true});
  }

  _keyboardDidHide () {
    this.setState({showSearch: false});
  }

  onChangeText(search) {
    this.setState({ search });
    search = search.toLowerCase();
    const {shops} = this.props.shops;
    let result = [];
    for(let shop of shops){
      let shopname = shop.name;
      shopname = shopname.toLowerCase();
      if( shopname.indexOf(search) !== -1 ) {
        result.push(shop);
      }
    }
    if( search !== '' ){
      this.setState({
        shops: result
      });
    }
  }

  onSearch() {
    this.setState({isAttempting: true});
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList(this.state.search, position.coords.latitude, position.coords.longitude);
        this.setState({isAttempting: false});
        this.props.navigation.navigate('Home');
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onClose() {
    this.props.onClose();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList(this.state.search, position.coords.latitude, position.coords.longitude);
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onRefresh = () => {
    const { search } = this.props.shops;
    this.props.refreshShopList(search)
  };

  onLoadMore = () => {
  };

  onClickLocation = () => {
    this.props.navigation.navigate("Map");
  }

  showAround = () => {
    this.setState({search: ''});
    this.setState({isAttempting: true});
    //this.onClose();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.refreshShopList(this.state.search, position.coords.latitude, position.coords.longitude);
        this.setState({isAttempting: false});
        this.props.navigation.navigate('Home');
      },
      (error) => { alert("Can't determine your current location"); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <ListItem
        icon
        key={rowData.id}
        onPress={() => this.props.gotoDetailShop(rowData.id)}
      >
        <Body>
          <Text style={{color: 'white'}}>{rowData.name}</Text>
        </Body>
        <Right>
            <Text style={{color: 'white'}}>{rowData.distance} miles</Text>
            <Icon name="arrow-forward" style={{color: 'white'}}/>
        </Right>
      </ListItem>
    );
  };
  
  render(){
    const {shops, search} = this.props.shops;
    return(
      <Container style={{backgroundColor:'#2e2d2e'}}>
        <ImageBackground source={require('../../Resources/Images/background.png')} style={styles.bg}>
          <Header style={styles.header} iosBarStyle="light-content">
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                <Icon name="md-menu" style={{backgroundColor:'transparent', color:'white'}}/>
              </Button>
            </Left>
            <Body>
              <Title style={styles.headertitle}></Title>
            </Body>
            <Right>
              <View style={{flexDirection:'row', justifyContent:'flex-start', flexDirection:'row'}}>
                <Button transparent style={styles.btnmenu}>
                  <Image source={require('../../Resources/Images/list.png')} style={styles.listicon}/>
                </Button>
                <Button transparent style={styles.btnmenu}>
                  <Icon name='ios-search' style={[styles.searchicon, {color: 'yellow'}]}/>
                </Button>
                <Button transparent style={styles.btnmenu} onPress={() => this.onClickLocation()}>
                  <IconEvilIcons name='location' style={[styles.locationicon]}/>
                </Button>
              </View>
            </Right>
          </Header>
          <Content style={styles.content} scrollEnabled={false}>
            <View style={{marginLeft : 15,marginRight: 15}}>
              <Item style={{borderBottomColor: 'yellow',borderBottomWidth: 1}}>
                <Input placeholder="Search" style={styles.searchinput} value={this.state.search} autoCorrect={false} onChangeText={(search)=>this.onChangeText(search)}/>
                <Icon name='ios-close' style={{fontSize: 40, color: 'yellow'}} onPress={()=>this.setState({search: ''})}/>
              </Item>
            </View>
            {
              (this.state.isAttempting) ?
                (<ActivityIndicator size="large" color="#ffffff" style={{marginTop: 10}}/>)
                : (<View />)
            }
            {
              (this.state.search) ?
                (<InfiniteListView
                  style={{width: width-20}}
                  dataArray={this.state.shops}
                  renderRow={this.renderRow}
                  onRefresh={this.onRefresh}
                  isRefreshing={this.state.isRefreshing}
                  canLoadMore={this.canLoadMoreContent}
                  isLoadingMore={this.state.isLoadingMore}
                  onLoadMore={this.onLoadMore}
                />) :
                (<View></View>)
            }
          </Content>
          {
            (this.state.showSearch) ? 
              (
                <TouchableOpacity onPress={() => this.onSearch()} style={styles.footertouch}>
                  <Left>
                    <Text style={{color:'#44b1c2'}}>SEARCH</Text>
                  </Left>
                  <Right>
                    <Image source={require('../../Resources/Images/onBoardingArrow.png')} />
                  </Right>
                </TouchableOpacity>
            ) :
              (<Footer style={{backgroundColor: 'transparent', borderTopColor: 'transparent'}}>
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={()=>this.showAround()}>
                <Text style={{color: 'white'}}>Show what's around me</Text>
                <IconIonic name="ios-arrow-down" style={{color: 'yellow'}}/>
              </TouchableOpacity>
            </Footer>)
          }
          <KeyboardSpacer/>
        </ImageBackground>
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
    gotoDetailShop: (shopId) =>{ 
      dispatch(ShopActions.gotoDetailShop(shopId));
    },
  };
};

const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)
const containerHeight = height-toolBarHeight;

const styles = {
  bg: {
    width: width,
    height: height,
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  headertitle: {
		color: 'white'
  },
  headerStyle:{
    height:toolBarHeight,
    paddingTop: Platform.OS === "ios" ? 15 : 0,
    flexDirection:'row',
    alignItems:'center'
  },
  contentContainer:{
    height:height
  },
  searchicon: {
    color: '#fff',
    fontSize: 25
  },
  content: {
		backgroundColor: 'transparent',
    flex: 1,
  },
  searchinput: {
    color: 'white',
    fontSize: 30,
  },
  searchview: {
    width: width,
    height: 70,
    //position:'relative',
    //bottom:-toolBarHeight,
    padding:10,
    backgroundColor:'yellow',
  },
  footertouch: {
    //flex: 0.5,
    width: width,
    //bottom:-toolBarHeight,
    height: 70,
    padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:'yellow',
  },
  btnmenu: {
    paddingHorizontal:2,
    paddingLeft: 5,
    paddingRight: 5
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
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
