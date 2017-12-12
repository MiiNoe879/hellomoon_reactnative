import AppNavigation from '../Navigation/AppNavigation'
export const ACTION_SLIDE_OPEN = 'ACTION_SLIDE_OPEN';
export const ACTION_SHOW_ERROR = 'ACTION_SHOW_ERROR';
export const ACTION_GOTO_DETAIL = 'ACTION_SHOW_ERROR';
export const ACTION_GOTO_EDIT = 'ACTION_GOTO_EDIT';
import {NavigationActions} from 'react-navigation'

const initialState = AppNavigation.router.getStateForAction(AppNavigation.router.getActionForPathAndParams('Splash'))
export const reducer = (state = initialState, action) => {
	let newState;
	switch(action.type){
		case ACTION_SLIDE_OPEN:
			newState = AppNavigation.router.getStateForAction(NavigationActions.navigate({routeName:'DrawerOpen'}), state)
			break
		case ACTION_GOTO_DETAIL:
			newState = AppNavigation.router.getStateForAction(NavigationActions.navigate({routeName:'NavigationShopDetailTab'}), state)
			break
		case ACTION_GOTO_EDIT:
			newState = AppNavigation.router.getStateForAction(NavigationActions.navigate({routeName:'NewShop'}), state)
			break
		default:
			newState = AppNavigation.router.getStateForAction(action, state)
	}
  
  return newState || state
}
