import React from "react";
import { StackNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";

// screens identified by the router
import Login from "../Containers/LoginScreen";
import LaunchScreen from "../Containers/LaunchScreen";
import NavigationDrawer from "./NavigationDrawer";
//import NavigationShopDetailTab from "./NavigationShopDetailTab";

//
import Splash from "../Containers/SplashScreen";

const PrimaryNav = StackNavigator(
	{
		Splash:{screen: Splash},
		//Login: { screen: Login },
		//LaunchScreen: { screen: LaunchScreen },
		NavigationDrawer: { screen: NavigationDrawer },
		//NavigationShopDetailTab: { screen: NavigationShopDetailTab }
	},
	{
		//initialRouteName: "Splash",
		headerMode: "none",
	}
);

export default PrimaryNav;
