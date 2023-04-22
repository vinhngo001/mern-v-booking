import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
const initialState = {};

const middleware = [thunk];

const myStore = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const DataProvider = ({children}) => {
    return(
        <Provider store={myStore}>
            {children}
        </Provider>
    )
}
export default DataProvider;