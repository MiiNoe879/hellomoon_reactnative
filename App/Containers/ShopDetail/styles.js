import { Dimensions, StyleSheet, Platform } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const toolBarHeight = (Platform.OS === "ios" ? 64 : 56)

const styles: any = StyleSheet.create({
	header: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    icon: {
        color: 'white',
        fontSize: 25
    },
    menuicon: {
        color: 'white',
        fontSize: 18
    },
	headertitle: {
		color: 'white'
    },
    bottomOverStyle:{
        position:'absolute',    
        height:toolBarHeight,
        bottom:0,left:0,right:0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        backgroundColor: 'transparent'
    },
    bg: {
        width: deviceWidth,
        height: deviceHeight
    },
    detailbg: {
        width: deviceWidth-20,
        height: 'auto',
        marginLeft: 10,
        marginRight: 10
    },
    subview: {
        marginTop: 20,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10
    },
    round: {
        width: (deviceWidth-60)/3,
        height: (deviceWidth-60)/3,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: (deviceWidth-60)/3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    instagramview: {
        backgroundColor: 'white',
        width: deviceWidth-20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 20,
    },
    footertouch: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
    },
    footer: {
		flexDirection: 'column'
	},
	footertouchButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor:'yellow',
		paddingLeft: 10,
		paddingRight: 10
	},
});
export default styles;
