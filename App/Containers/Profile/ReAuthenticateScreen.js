import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "./styles";
const {width, height} = Dimensions.get('window');
import { EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_LOGIN } from '../../Constants/constants.js'

import { connect } from 'react-redux';
import LoginActions from "../../Redux/LoginRedux";

class ReAuthenticateScreen extends React.Component {
	
	constructor(props) {
		super(props);
		this.state={
			password:'',
		}
	}
	
	componentWillReceiveProps(nextProps) {
	}

	onVerify() {
		this.props.attemptVerify(this.state.password);
    }
    
	render() {
		const {fetching} = this.props.login;
		return (
			<Container>
				<Header style={styles.header} iosBarStyle="light-content">
					<Left/>
					<Body>
						<Title style={styles.headertitle}></Title>
					</Body>
					<Right>
						<Button transparent onPress = {this.props.onClose} style={styles.menubtn}>
							<IconIonic name="ios-close" style={styles.closeicon}/>
						</Button>
					</Right>
				</Header>
				<Content style={styles.content}>
					<Form>
						<Item stackedLabel last>
							<Label style={styles.label}>Password</Label>
							<Input style={styles.whiteinput} value={this.state.password} onChangeText={(password)=>this.setState({password:password})} secureTextEntry={true}/>
						</Item>
                        <Text style={{marginTop: 20, color: 'white'}}>For your security, please enter your current password.</Text>
					</Form>
				</Content>
				<Footer style={[styles.footer, {height: 60}]}>
					<View style={{backgroundColor: 'yellow'}}>
						{
						(fetching) ? 
							(<Spinner color='#45D56E' style={{height: 60}}/>)
						:	(<TouchableOpacity onPress={() => this.onVerify()} style={styles.footertouch}>
								<Left>
									<Text style={{color:'#44b1c2'}}>VERIFY</Text>
								</Left>
								<Right>
									<Image source={require('../../Resources/Images/onBoardingArrow.png')} />
								</Right>
							</TouchableOpacity>)
						}
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
		attemptVerify: (data) => dispatch(LoginActions.verifyRequest(data)),
		init: () => dispatch(LoginActions.init())
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(ReAuthenticateScreen)
