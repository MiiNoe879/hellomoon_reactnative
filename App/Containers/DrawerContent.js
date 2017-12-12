import React, { Component } from "react";
import { Image, BackHandler, StatusBar, Platform, Dimensions, TouchableOpacity, Modal} from "react-native";
import {Container, List, ListItem, Text, View, Content, Thumbnail, Button, Footer, FooterTab, Left, Right, Body} from "native-base";
import IconEntypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

import LoginActions from "../Redux/LoginRedux";
import ShopActions from "../Redux/ShopRedux";

import Login from './Login';
import Signup from './Signup';

//import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";
const {width, height} = Dimensions.get('window');
const statusbarHeight = (Platform.OS ==='ios'?20:0)
class DrawerContent extends Component {
	constructor(props){
		super(props)
		this.state={login:false, modalVisible: false, modalSignupVisible: false}
	}

	setModalVisible(visible) {
		this.setState({modalVisible: visible});
	}

	setModalSignupVisible(visible) {
		this.setState({modalSignupVisible: visible});
	}
	
	onLogin() {
		this.setModalSignupVisible(false);
		this.props.navigation.navigate('DrawerClose');
		this.setModalVisible(true);
	}

	onSignup() {
		this.setModalVisible(false);
		this.setModalSignupVisible(true);
	}
	onSignOut() {
		this.props.attemptSignout();
		this.props.navigation.navigate("Home");
	}
	
	onCloseLoginModal() {
		this.setModalVisible(false);
	}

	onCloseSignupModal() {
		this.setModalSignupVisible(false);
	}

	render() {
		const navigation = this.props.navigation;
		const items = this.props.items;
		const {loggedIn} = this.props.login;
		const {userinfo} = this.props.login;
		let image = require('../Resources/Images/guestIcon.png');
		if(userinfo.image)
			image = {uri: userinfo.image};
		return (
			<Container>				
				<Image source={require('../Resources/Images/splashScreenBg.png')} style={{width:'100%', height:'100%', resizeMode:'cover',position:'absolute', top:statusbarHeight}}/>
				<Content style={{position:'absolute',top:statusbarHeight, width:'100%', height: '100%'}}>
					<View style={{flexDirection:'row', alignItems:'center'}}>
						<Thumbnail large source={image} style={{margin:20}}/>
						{
							(loggedIn) ?
							(<Text style={{color:'white', fontSize:20}}>{userinfo.firstname} {userinfo.lastname}</Text>)
							: 
							(<Text style={{color:'white', fontSize:20}}>Guest</Text>)
						}
					</View>
					<List>
						<ListItem icon onPress={()=>navigation.navigate('Home')}>
							<Left>
								<Image source={require('../Resources/Images/homeIcon.png')} style={styles.homeicon}/>
							</Left>
							<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Home</Text></Body>							
						</ListItem>
						{
						(loggedIn) ? 
							(<View>
								<ListItem icon onPress={()=>navigation.navigate('Profile')}>
									<Left>
										<Image source={require('../Resources/Images/userMenuProfileIcon.png')} style={styles.homeicon} />
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Profile</Text></Body>							
								</ListItem>
								<ListItem icon>
									<Left>
										<Image source={require('../Resources/Images/orderHistory.png')} style={styles.homeicon}/>
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Order History</Text></Body>							
								</ListItem>
								<ListItem icon>
									<Left>
										<Image source={require('../Resources/Images/wallet.png')} style={styles.homeicon}/>
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Wallet</Text></Body>							
								</ListItem>
							</View>)
						:	(<View>
								<ListItem icon style={styles.itemdisabled}>
									<Left>
										<Image source={require('../Resources/Images/userMenuProfileIcon.png')} style={styles.homeicon}/>
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Profile</Text></Body>							
								</ListItem>
								<ListItem icon style={styles.itemdisabled}>
									<Left>
										<Image source={require('../Resources/Images/orderHistory.png')} style={styles.homeicon}/>
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Order History</Text></Body>							
								</ListItem>
								<ListItem icon style={styles.itemdisabled}>
									<Left>
										<Image source={require('../Resources/Images/wallet.png')} style={styles.homeicon}/>
									</Left>
									<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Wallet</Text></Body>							
								</ListItem>
							</View>)
						}
						{
						(userinfo.role==2) ? 
							(<ListItem icon onPress={()=>this.props.gotoEditShop()}>
								<Left>
									<IconEntypo name="shop" style={styles.homeicon} style={styles.listitemicon}/>
								</Left>
								<Body style={{borderBottomWidth: 0}}>
									<Text style={{color:'white'}}>Add A New Shop</Text>
								</Body>
							</ListItem>) : 
							(<View></View>)	
						}
						<ListItem icon>
							<Left>
								<Image source={require('../Resources/Images/helpCenter.png')} style={styles.homeicon}/>
							</Left>
							<Body style={{borderBottomWidth: 0}}>
								<Text style={{color:'white'}}>Help Center</Text>
							</Body>
						</ListItem>
						<ListItem icon >
							<Left>
								<Image source={require('../Resources/Images/helpCenter.png')} style={styles.homeicon}/>
							</Left>
							<Body style={{borderBottomWidth: 0}}><Text style={{color:'white'}}>Help Center Question</Text></Body>
						</ListItem>
					</List>
				</Content>
				<Footer style={{position:'absolute', bottom:0,padding:10, backgroundColor:'yellow'}}>
					{
						(loggedIn) ? 
							(<TouchableOpacity onPress={() => this.onSignOut()} style={styles.footertouch}>
								<Left>
									<Text style={{color:'#44b1c2'}}>SIGN OUT</Text>
								</Left>
								<Right>
									<Image source={require('../Resources/Images/onBoardingArrow.png')} />
								</Right>
							</TouchableOpacity>)
						:	(<TouchableOpacity onPress={() => this.onLogin()} style={styles.footertouch}>
								<Left>
									<Text style={{color:'#44b1c2'}}>LOGIN</Text>
								</Left>
								<Right>
									<Image source={require('../Resources/Images/onBoardingArrow.png')} />
								</Right>
							</TouchableOpacity>)
					}
				</Footer>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
				>
					<Login onClose={() => {this.onCloseLoginModal()}} onSignup={() => {this.onSignup()}}/>
				</Modal>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalSignupVisible}
					onRequestClose={() => {}}
				>
					<Signup onClose={() => {this.onCloseSignupModal()}} onLogin={() => {this.onLogin()}}/>
				</Modal>
			</Container>
		);
	}
}
let styles={
	container:{
		marginTop:Platform.OS==='ios'?20:0
	},
	homeicon: {
		resizeMode: 'contain',
		width: 22,
		height: 22
	},
	footertouch: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	item: {
		borderBottomColor: 'transparent'
	},
	listitemicon: {
		color: 'white',
		fontSize: 20
	},
	itemdisabled: {
		opacity: 0.5
	}
}

const mapStateToProps = state => {
    return {
		login: state.login,
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
		attemptSignout: () =>dispatch(LoginActions.logout()),
		gotoEditShop: () =>{ 
            dispatch(ShopActions.gotoEditShop(0));
        },
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(DrawerContent)
//export default DrawerContent;