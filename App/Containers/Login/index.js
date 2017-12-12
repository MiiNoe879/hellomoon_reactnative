import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "./styles";
const {width, height} = Dimensions.get('window');
import { EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_LOGIN } from '../../Constants/constants.js'

import { connect } from 'react-redux';
import LoginActions from "../../Redux/LoginRedux";

class Login extends React.Component {
	
	constructor(props) {
		super(props);
		this.state={
			email:'',
			password:'',
			login: {}
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if(this.props.login.error!=nextProps.login.error){
			const {error} = nextProps.login;
			const {message} = nextProps.login;
			if(error == EMPTY_EMAIL){
				alert("You must input email")
				this.props.logout()
			}
			else if(error == EMPTY_PASSWORD){
				alert("You must input password")
				this.props.logout()
			}
			else if(error == ERROR_LOGIN){
				alert(nextProps.login.message)
				this.props.logout()
			}
			else if(error != 'error'){
				if(message===''){
					this.props.attemptUserInfo()
					this.props.onClose()
				}
				else{
					alert('We had just sent email to '+message)
				}
			}
		}
	}

	onLogin() {
		this.props.attemptSignin(this.state)
	}

	onForgot() {
		this.props.attemptForgot(this.state)
	}

	render() {
		const {fetching} = this.props.login;
		return (
			<Container>
				<Header style={styles.header} iosBarStyle="light-content">
					<Left/>
					<Body>
						<Title style={styles.headertitle}>LOGIN</Title>
					</Body>
					<Right>
						<Button transparent onPress = {this.props.onClose} style={styles.menubtn}>
							<IconIonic name="ios-close" style={styles.closeicon}/>
						</Button>
					</Right>
				</Header>
				<Content style={styles.content}>
					<Image source={require('../../Resources/Images/splashScreenLogo.png')} style={styles.logo}/>
					<Form>
						<Item stackedLabel last>
							<Label style={styles.label}>Email</Label>
							<Input style={styles.whiteinput} autoCapitalize='none' autoCorrect={false} keyboardType='email-address' value={this.state.email} onChangeText={(email)=>this.setState({email:email})}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>Password</Label>
							<Input style={styles.whiteinput} value={this.state.password} onChangeText={(password)=>this.setState({password:password})} secureTextEntry={true}/>
						</Item>
						<TouchableOpacity style={styles.linktouch} onPress={() => this.onForgot()}>
							<Label></Label>
							<Label style={styles.linklabel}>FORGOT PASSWORD</Label>
						</TouchableOpacity>
					</Form>
				</Content>
				<Footer style={styles.footer}>
					<View style={{backgroundColor: 'yellow'}}>
						{
						(fetching) ? 
							(<Spinner color='#45D56E' style={{height: 60}}/>)
						:	(<TouchableOpacity onPress={() => this.onLogin()} style={styles.footertouch}>
								<Left>
									<Text style={{color:'#44b1c2'}}>SIGN IN</Text>
								</Left>
								<Right>
									<Image source={require('../../Resources/Images/onBoardingArrow.png')} />
								</Right>
							</TouchableOpacity>)
						}
					</View>
					<TouchableOpacity onPress={() => this.props.onSignup()} style={styles.signuptouch}>
						<Left>
							<Text style={{color:'#44b1c2',fontSize: 10}}>Create Account</Text>
						</Left>
					</TouchableOpacity>
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
		attemptSignin: (data) => dispatch(LoginActions.loginRequest(data)),
		attemptUserInfo: () => dispatch(LoginActions.userInfoRequest()),
		attemptForgot: (data) => dispatch(LoginActions.forgotPasswordRequest(data)),
		logout: () => dispatch(LoginActions.logout())
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(Login)
