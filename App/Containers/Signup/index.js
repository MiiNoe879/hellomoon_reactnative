import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import { EMPTY_FIRST_NAME, EMPTY_LAST_NAME, EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_SIGNUP, EMPTY_CONFIRM_PASSWORD, EMPTY_ZIPCODE, PASSWORD_MISMATCH, WEAK_PASSWORD } from '../../Constants/constants.js'
import styles from "./styles";
const {width, height} = Dimensions.get('window');

import { connect } from 'react-redux';
import SignupActions from "../../Redux/SignupRedux";
import LoginActions from "../../Redux/LoginRedux";

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			firstname: '',
			lastname: '',
			email:'',
			password:'',
			confirmpassword: '',
			zipcode: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.signup.error!=nextProps.signup.error){
			const {error} = nextProps.signup;
			if(error == EMPTY_FIRST_NAME){
				alert("You must input first name")
				this.props.logout()
			}
			else if(error == EMPTY_LAST_NAME){
				alert("You must input last name")
				this.props.logout()
			}
			else if(error == EMPTY_EMAIL){
				alert("You must input email")
				this.props.logout()
			}
			else if(error == EMPTY_PASSWORD){
				alert("You must input password")
				this.props.logout()
			}
			else if(error == EMPTY_CONFIRM_PASSWORD){
				alert("You must input confirm password")
				this.props.logout()
			}
			else if(error == PASSWORD_MISMATCH){
				alert("Password is mismatching")
				this.props.logout()
			}
			else if(error == EMPTY_ZIPCODE){
				alert("You must input zip code")
				this.props.logout()
			}
			else if(error == WEAK_PASSWORD){
				alert("Password should be 6 letters over")
				this.props.logout()
			}
			else if(error == ERROR_SIGNUP){
				alert(nextProps.signup.message)
				this.props.logout()
			}
			else if(error != 'error'){
				this.props.attemptSignin(this.state)
				this.props.attemptUserInfo()
				this.props.onClose()
			}
		}
	}

	onLogin() {
		this.props.onLogin();
	}

	onSignUp() {
		this.props.attemptSignup(this.state)
	}

	render() {
		const {fetching} = this.props.signup;
		return (
			<Container>
				<Header style={styles.header} iosBarStyle="light-content">
					<Left/>
					<Body>
						<Title style={styles.headertitle}>Sign up</Title>
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
							<Label style={styles.label}>First Name</Label>
							<Input style={styles.whiteinput} autoCorrect='false' value={this.state.firstname} onChangeText={(firstname)=>this.setState({firstname:firstname})}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>Last Name</Label>
							<Input style={styles.whiteinput} autoCorrect='false' value={this.state.lastname} onChangeText={(lastname)=>this.setState({lastname:lastname})}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>Email</Label>
							<Input style={styles.whiteinput} autoCapitalize='none' autoCorrect='false' keyboardType='email-address' value={this.state.email} onChangeText={(email)=>this.setState({email:email})}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>Password</Label>
							<Input style={styles.whiteinput} value={this.state.password} onChangeText={(password)=>this.setState({password:password})} secureTextEntry={true}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>Confirm Password</Label>
							<Input style={styles.whiteinput} value={this.state.confirmpassword} onChangeText={(confirmpassword)=>this.setState({confirmpassword:confirmpassword})} secureTextEntry={true}/>
						</Item>
						<Item stackedLabel last>
							<Label style={styles.label}>ZIP Code</Label>
							<Input style={styles.whiteinput} autoCapitalize='none' autoCorrect='false' value={this.state.zipcode} onChangeText={(zipcode)=>this.setState({zipcode:zipcode})}/>
						</Item>
					</Form>
				</Content>
				<Footer style={styles.footer}>
					<View style={{backgroundColor: 'yellow'}}>
						{
						(fetching) ? 
							(<Spinner color='#45D56E' style={{height: 60}}/>)
						:	(<TouchableOpacity onPress={() => this.onSignUp()} style={styles.footertouch}>
								<Left>
									<Text style={{color:'#44b1c2'}}>SIGN UP</Text>
								</Left>
								<Right>
									<Image source={require('../../Resources/Images/onBoardingArrow.png')} />
								</Right>
							</TouchableOpacity>)
						}
					</View>
					<TouchableOpacity onPress={() => this.onLogin()} style={styles.signuptouch}>
						<Left>
							<Text style={{color:'#44b1c2',fontSize: 10}}>LOGIN</Text>
						</Left>
					</TouchableOpacity>
				</Footer>
			</Container>
		);
	}
}

const mapStateToProps = state => {
    return {
		signup: state.signup
    };
};

const mapDisaptchToProps = (dispatch) =>{
    return{
		attemptSignup: (data) =>dispatch(SignupActions.signupRequest(data)),
		attemptSignin: (data) =>dispatch(LoginActions.loginRequest(data)),
		attemptUserInfo: () => dispatch(LoginActions.userInfoRequest()),
		logout: (data) =>dispatch(SignupActions.logout())
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(Signup)

