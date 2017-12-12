import * as React from "react";
import { Image, Platform, StatusBar, Dimensions, TouchableOpacity, Modal, Alert } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Picker, Left, Right, Form, Item, Label, Input, Spinner, Thumbnail } from "native-base";
import IconIonic from 'react-native-vector-icons/Ionicons';
import styles from "./styles";
const {width, height} = Dimensions.get('window');
import LoginActions from "../../Redux/LoginRedux";
import { ERROR_SAVE, EMPTY_FIRST_NAME, EMPTY_LAST_NAME, EMPTY_EMAIL, EMPTY_PASSWORD, ERROR_LOGIN, ERROR_SIGNUP, EMPTY_CONFIRM_PASSWORD, EMPTY_ZIPCODE, PASSWORD_MISMATCH, WEAK_PASSWORD, PASSWORD_INCORRECT, SUCCESS_VERIFY } from '../../Constants/constants.js'

import { connect } from 'react-redux';

import ImageLoad from '../../Components/ImageLoad/ImageLoad';
var ImagePicker = require('react-native-image-picker');
import Verify from './ReAuthenticateScreen';

class EditProfileScreen extends React.Component {
	
	constructor(props) {
        super(props);
        const {userinfo} = this.props.login;
		this.state={
            firstname: userinfo.firstname,
            lastname: userinfo.lastname,
            zipcode: userinfo.zipcode,
            phone: (userinfo.phone) ? userinfo.phone : '',
            gender: (userinfo.gender) ? userinfo.gender : 0,
            role: (userinfo.role) ? userinfo.role : 1,
            newpassword: '',
            image: (userinfo.image) ? {uri: userinfo.image} : require('../../Resources/Images/guestIcon.png'),
            isVerifyModalVisible: false,
		}
    }
    
    componentWillReceiveProps(nextProps) {
		if(this.props.login.error!=nextProps.login.error){
			const {error} = nextProps.login;
			const {message} = nextProps.login;
			if(error == EMPTY_FIRST_NAME){
				alert("You must input first name")
				this.props.init()
			}
			else if(error == EMPTY_LAST_NAME){
				alert("You must input last name")
				this.props.init()
			}
			else if(error == EMPTY_ZIPCODE){
				alert("You must input zip code")
				this.props.init()
			}
			else if(error == EMPTY_PASSWORD){
				alert("You must input password")
				this.props.init()
            }
            else if(error == PASSWORD_MISMATCH){
				alert("Password is mismatching")
				this.props.init()
            }
            else if(error == PASSWORD_INCORRECT){
				alert("Password is incorrect")
				this.props.init()
			}
			else if(error == ERROR_SIGNUP){
				alert(nextProps.login.message)
				this.props.init()
            }
            else if(error == ERROR_LOGIN){
                alert(nextProps.login.message)
				this.props.init()
            }
            else if(error == SUCCESS_VERIFY) {
                this.setState({isVerifyModalVisible: false});
                this.props.attemptSave(this.state);
            }
			else if(error != 'error'){
                this.props.attemptUserInfo()
                Alert.alert(
                    'Alert',
                    'Your Profile Updated',
                    [
                        {text: 'OK', onPress: () => this.props.navigation.navigate('Profile')},
                    ],
                    { cancelable: false }
                )
			}
		}
	}

	onSave() {
        if(this.state.newpassword !== ''){
            this.setState({isVerifyModalVisible: true});
        } else {
            this.props.attemptSave(this.state);
        }
    }
    
    onSelectImage() {
        var options = {
            title: 'Select Image',
            customButtons: [
                {name: 'remove', title: 'Remove Current Photo'},
            ],
        };
        
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {//remove current photo
                this.setState({image: require('../../Resources/Images/guestIcon.png')});
            }
            else {
                let source = { uri: response.uri };          
                this.setState({
                    image: source
                });
            }
        });
    }

    onCloseVerifyModal() {
        this.setState({isVerifyModalVisible: false});
    }

	render() {
		const {userinfo} = this.props.login;
        const {fetching} = this.props.login;
		return (
			<Container>
				<Header style={styles.header} iosBarStyle="light-content">
					<Left>
						<Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon name="arrow-back" style={{backgroundColor:'transparent', color:'white'}}/>
						</Button>
					</Left>
					<Body>
					</Body>
					<Right/>
				</Header>
				<Content style={styles.content}>
                    <TouchableOpacity onPress={() => this.onSelectImage()} style={{alignItems:'center',justifyContent:'center'}}>
                        <ImageLoad 
							source={this.state.image}
							loadingStyle={{ size: 'small', color: 'grey' }}
							placeholderSource={require('../../Resources/Images/guestIcon.png')}
							placeholderStyle={styles.shopimage}
							style={{width: 80,height: 80}}
							imageStyle={{resizeMode: 'stretch', width: 80, height: 80}}
							borderRadius={40}
						/>
                        <Text style={{color: 'white', marginBottom: 20}}>Change Profile Photo</Text>
                    </TouchableOpacity>
                    <Form>
                        <Item stackedLabel last>
                            <Label style={styles.label}>First Name</Label>
                            <Input style={styles.whiteinput} autoCorrect={false} keyboardType='email-address' value={this.state.firstname} onChangeText={(firstname)=>this.setState({firstname:firstname})}/>
                        </Item>
                        <Item stackedLabel last>
                            <Label style={styles.label}>Last Name</Label>
                            <Input style={styles.whiteinput} autoCorrect={false} keyboardType='email-address' value={this.state.lastname} onChangeText={(lastname)=>this.setState({lastname:lastname})}/>
                        </Item>
                        {
                            (this.state.gender==0) ?
                                (
                                    <View style={{flexDirection: 'row', height: 50, marginTop: 10, marginBottom: 10}}>
                                        <TouchableOpacity onPress={()=>this.setState({gender: 0})} style={{width: width/2-10, borderBottomColor: 'yellow', borderBottomWidth: 2, alignItems:'center', justifyContent: 'center'}}><Text style={{color: 'white'}}>Male</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.setState({gender: 1})} style={{width: width/2-10, alignItems:'center', justifyContent: 'center', marginRight: 10}}><Text style={{color: 'white'}}>Female</Text></TouchableOpacity>
                                    </View>
                                )
                                :
                                (
                                    <View style={{flexDirection: 'row', height: 50, marginTop: 10, marginBottom: 10}}>
                                        <TouchableOpacity onPress={()=>this.setState({gender: 0})} style={{width: width/2-10, alignItems:'center', justifyContent: 'center'}}><Text style={{color: 'white'}}>Male</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.setState({gender: 1})} style={{width: width/2-10, borderBottomColor: 'yellow', borderBottomWidth: 2, alignItems:'center', justifyContent: 'center'}}><Text style={{color: 'white'}}>Female</Text></TouchableOpacity>
                                    </View>
                                )
                        }
                        <Item stackedLabel last>
                            <Label style={styles.label}>ZIPCODE</Label>
                            <Input style={styles.whiteinput} value={this.state.zipcode} onChangeText={(zipcode)=>this.setState({zipcode:zipcode})}/>
                        </Item>
                        <Item stackedLabel last>
                            <Label style={styles.label}>PHONE</Label>
                            <Input style={styles.whiteinput} value={this.state.phone} onChangeText={(phone)=>this.setState({phone:phone})}/>
                        </Item>
                        <Item stackedLabel last>
                            <Label style={styles.label}>New Password</Label>
                            <Input style={styles.whiteinput} value={this.state.newpassword} onChangeText={(newpassword)=>this.setState({newpassword:newpassword})} secureTextEntry={true}/>
                        </Item>
                    </Form>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.isVerifyModalVisible}
                        onRequestClose={() => {}}
                    >
                        <Verify onClose={() => {this.onCloseVerifyModal()}} />
                    </Modal>
                </Content>
                <Footer style={styles.footer}>
                    <View style={{backgroundColor: 'yellow'}}>
                        {
                        (fetching) ? 
                            (<Spinner color='#45D56E' style={{height: 60}}/>)
                        :	(<TouchableOpacity onPress={() => this.onSave()} style={styles.footertouch}>
                                <Left>
                                    <Text style={{color:'#44b1c2'}}>SAVE</Text>
                                </Left>
                                <Right>
                                    <Image source={require('../../Resources/Images/onBoardingArrow.png')} />
                                </Right>
                            </TouchableOpacity>)
                        }
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')} style={styles.signuptouch}>
                        <Left>
                            <Text style={{color:'#44b1c2',fontSize: 10}}>CANCEL</Text>
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
        attemptSave: (data) => dispatch(LoginActions.updateUser(data)),
        attemptUserInfo: () => dispatch(LoginActions.userInfoRequest()),
        init: () => dispatch(LoginActions.init()),
    }
}
export default connect(mapStateToProps, mapDisaptchToProps)(EditProfileScreen)
