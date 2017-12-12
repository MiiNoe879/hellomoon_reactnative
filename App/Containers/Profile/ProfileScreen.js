import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner, Thumbnail } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "./styles";
import ImageLoad from '../../Components/ImageLoad/ImageLoad';
const {width, height} = Dimensions.get('window');

import { connect } from 'react-redux';

class ProfileScreen extends React.Component {
	
	constructor(props) {
		super(props);
		this.state={
		}
	}

	render() {
		const {userinfo, email} = this.props.login;
		let image = require('../../Resources/Images/guestIcon.png');
		if(userinfo.image)
			image = {uri: userinfo.image};
		return (
			<Container>
				<Header style={styles.header} iosBarStyle="light-content">
					<Left>
						<Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
							<Icon name="md-menu" style={{backgroundColor:'transparent', color:'white'}}/>
						</Button>
					</Left>
					<Body>
					</Body>
					<Right/>
				</Header>
				<Content style={styles.content} scrollEnabled={false}>
					<View style={{alignItems:'center',justifyContent:'center'}}>
						<ImageLoad 
							source={image}
							loadingStyle={{ size: 'small', color: 'grey' }}
							placeholderSource={require('../../Resources/Images/guestIcon.png')}
							placeholderStyle={styles.shopimage}
							style={{width: 80,height: 80}}
							imageStyle={{resizeMode: 'stretch', width: 80, height: 80}}
							borderRadius={40}
						/>
					</View>
					<Form>
                        <View style={{marginBottom: 30, marginLeft: 20, marginTop: 20}}>
							<Label style={styles.label}>ZIPCODE</Label>
                            <Text style={{color: 'white',fontSize: 20}}>{userinfo.zipcode}</Text>
						</View>
						<View style={{marginLeft: 20}}>
							<Label style={styles.label}>Email</Label>
                            <Text style={{color: 'white',fontSize: 20}}>{email}</Text>
						</View>
					</Form>
				</Content>
				<Footer style={[styles.footer, {height: 60}]}>
					<View style={{backgroundColor: 'yellow'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("EditProfile")} style={styles.footertouch}>
                            <Left>
                                <Text style={{color:'#44b1c2'}}>EDIT PROFILE</Text>
                            </Left>
                            <Right>
                                <Image source={require('../../Resources/Images/onBoardingArrow.png')} />
                            </Right>
                        </TouchableOpacity>
					</View>
				</Footer>
			</Container>
		);
	}
}

const mapStateToProps = state => {
    return {
		login: state.login,
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(ProfileScreen)
