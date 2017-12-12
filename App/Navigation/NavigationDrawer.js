import React from "react";
import { DrawerNavigator } from "react-navigation";
import ListviewExample from "../Containers/ListviewExample";
import CardExample from "../Containers/CardExample";
import DrawerContent from "../Containers/DrawerContent";
import NavigationShopDetailTab from "./NavigationShopDetailTab";

import styles from "./Styles/NavigationStyles";
import HomeScreen from "../Containers/InDrawer/HomeScreen";
import NewShop from "../Containers/NewShop/NewShop";
import Map from "../Containers/Map/MapScreen";
import Search from "../Containers/Search/SearchScreen";
import ProfileScreen from "../Containers/Profile/ProfileScreen";
import EditProfileScreen from "../Containers/Profile/EditProfileScreen";

const NavigationDrawer = DrawerNavigator({
		ListviewExample: { screen: ListviewExample },
		/*CardExample: { screen: CardExample },*/
		Home: { screen: HomeScreen },
		NavigationShopDetailTab: { screen: NavigationShopDetailTab },
		NewShop: {screen: NewShop},
		Map: {screen: Map},
		Search: {screen: Search},
		Profile: { screen: ProfileScreen },
		EditProfile: { screen: EditProfileScreen },
		/*OrderHistory:{screen:OrderHistoryScreen},
		Wallet:{screen:WalletScreen},
		AddNewShop:{Screen: AddNewShopScreen},
		HelpCenter:{Screen: HelpCenter}
		FAQ:{Screen: FAQScreen}*/
	},
	{
		initialRouteName: "Home",
		contentComponent: props => <DrawerContent {...props} />,
		drawerBackgroundColor:'transparent'
	}
);

export default NavigationDrawer;
