import { Dimensions, StyleSheet } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const styles: any = StyleSheet.create({
	header: {
		backgroundColor: '#2ba9fc',
		borderBottomColor: 'transparent'
	},
	headertitle: {
		color: 'white'
	},
	content: {
		backgroundColor: '#2ba9fc',
		paddingLeft: 10,
		paddingRight: 10
	},
	closeicon: {
		fontSize: 35,
		color: 'yellow'
	},
	footer: {
		flexDirection: 'column',
		height: 90
	},
	footertouch: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor:'yellow',
		height: 60,
		paddingLeft: 10,
		paddingRight: 10
	},
	signuptouch: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor:'white',
		height: 30,
		paddingLeft: 10,
		paddingRight: 10
	},
	label: {
		color: 'white',
		fontSize: 13
	},
	linklabel: {
		color: 'white',
		fontSize: 10
	},
	logo: {
		width: deviceWidth,
		resizeMode: 'contain',
	},
	linktouch: {
		marginTop: 10,
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	whiteinput: {
		color: 'white'
	},
	shopimage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		resizeMode: 'stretch'
	}
});
export default styles;
