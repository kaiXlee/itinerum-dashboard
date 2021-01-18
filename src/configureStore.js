import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import { en } from 'language'
import rootReducer from './reducers'


const initialState = {
    intl: {
        defaultLocale: en.locale,
        locale: en.locale,
        messages: en.messages
    }
}


export default function configureStore(history) {
    const logger = createLogger({
        collapsed: true,
        predicate: () =>
            process.env.NODE_ENV === `development`, // eslint-disable-line no-unused-vars
    });

    const routingMiddleware = routerMiddleware(history)
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, logger, routingMiddleware)
    )


    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers').default
            store.replaceReducer(nextRootReducer)
        });
    }

    return store
}
