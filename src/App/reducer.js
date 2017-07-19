import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { configReducer } from './Config/entities';

export default combineReducers({
    routing: routerReducer,
    config: configReducer
});
