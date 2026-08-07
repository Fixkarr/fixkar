import {configureStore} from '@reduxjs/toolkit'

import rootReducer from './rootReducer.js'

export const store = configureStore({
    reducer : rootReducer,
    devTools : import.meta.env.VITE_NODE_ENV !== 'production' ? true : false,
})