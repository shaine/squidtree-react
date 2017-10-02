import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { configReducer } from './Config/entities';
import { colorReducer } from './Color/entities';

export default combineReducers({
    config: configReducer,
    routing: routerReducer,
    temperature: colorReducer
});
