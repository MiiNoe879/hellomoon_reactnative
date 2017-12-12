import * as React from "react";
import { Alert,Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import AddCart from './Menu/AddCart'


import Geocoder from 'react-native-geocoding';
var geolib = require("geolib");
import openMap from 'react-native-open-maps';

import ShopActions from "../../Redux/ShopRedux";
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import ImageLoad from '../../Components/ImageLoad/ImageLoad';

import styles from "./styles";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56);

class Menu extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'MENU',
        tabBarIcon: ({ tintColor }) => (
            <IconFontAwesome name='file-text-o' style={styles.menuicon} />
        ),
    };

	constructor(props) {
        super(props);
        this.state={
            selectedShopId: '',
            distance: '',
            menuItemList : [
                {
                    item : 'Americano', price: '3.35'
                },
                {
                    item : 'Cappuccino', price: '3.35'
                },
                {
                    item : 'Chai Latte', price: '3.35'
                },
                {
                    item : 'Cold Brew', price: '3.35'
                }
            ],
            modalCartVisible: false,
            menuItem:''
        }
        
        const {selectedShopId} = this.props.shops;
        this.props.attemptShopInfo(selectedShopId);
    }

    componentWillReceiveProps(nextState, nextProps) {

    }

    componentDidMount() {
       
    }
    
    
    onAddCart(Itemlist) {       
        this.setState({menuItem : Itemlist},
            this.setState({modalCartVisible: true})
        );		
	}
	
	onCloseModalCart(visible) {
		this.setState({modalCartVisible: visible});
    }

	render() {
        const {userinfo} = this.props.login;
        const {shop} = this.props.shops;
        //this.getDistance();
        const {selectedShopId} = this.props.shops;
        const features = shop.features;
        const storeStatus = 0; //Store close status
        
        //navigate
        
        const self = this;
        
		return (
            <View>
			<Container>
                
                <Image source={require('../../Resources/Images/storeMenuBottomShadow.png')} style={styles.bg}>
                    <Image source={require('../../Resources/Images/storeMenuTopShadow.png')} style={{width:deviceWidth,height:80,top:0,left:0}}>
                        <Header style={styles.header} iosBarStyle="light-content">
                            <Left>
                                <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                                    <Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
                                </Button>
                            </Left>
                            <Body>
                                <Title style={styles.headertitle}>MENU</Title>
                            </Body>
                            <Right>
                                {
                                    (userinfo.role==2) ? 
                                        (<Button transparent onPress={() => this.props.gotoEditShop(selectedShopId)}>
                                            <Text style={{color: 'white'}}>Edit</Text>
                                    </Button>) : (<View></View>)
                                }
                            </Right>
                        </Header>
                    </Image>
                   
                    {
                        (storeStatus == 0) ? 
                            (<View style={{position: 'absolute',zIndex: 10,width: deviceWidth,left: 0,top: 80, backgroundColor: 'red',paddingTop: 10, paddingBottom: 10}}>
                                <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                                    This Store is currently closed.
                                </Text>
                            </View>) : (<View></View>)
                    }
                   
                    <Content style={styles.content}>   

						<View style={{marginTop: 80, marginLeft: 30, marginBottom: 30}}>
							<Text style={{color:'yellow', fontWeight:'bold', fontSize: 16}}>COFFEE</Text>							
						</View>
                        {
                          
                            this.state.menuItemList.map(function(Itemlist){
                                return(
                                <TouchableOpacity onPress={() => self.onAddCart(Itemlist)} style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center',padding:30, height: 50}}>
                                    <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-start'}}>
                                        <Text style={{color: 'white',textAlign:'center'}}>{Itemlist.item}</Text>
                                    </View>                          
                                    <Text style={{color: 'white',marginLeft: 80}}>${Itemlist.price}</Text>
                                    <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end'}}>
                                        <Icon name="arrow-forward" style={{backgroundColor:'transparent', color:'white'}}/>
                                    </View>
                                </TouchableOpacity>
                                );
                            })
                        }
						

					</Content>
          <LinearGradient colors={['#2e2d2e00','#000000ff']} style={styles.bottomOverStyle}>
          </LinearGradient>
                </Image>

                
			</Container>
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalCartVisible}
                onRequestClose={() => {}}
            >
                <AddCart onClose={() => {this.onCloseModalCart(false)}} Itemlist={this.state.menuItem} />
            </Modal>
            </View>
            
		);
	}
}

const mapStateToProps = state => {
    return {
        shops: state.shops,
        login: state.login
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
        attemptShopInfo: (shopId) => dispatch(ShopActions.shopInfoRequest(shopId)),
        gotoEditShop: (shopId) =>{ 
            dispatch(ShopActions.gotoEditShop(shopId));
        },
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(Menu)
