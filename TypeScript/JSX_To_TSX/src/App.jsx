import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { Provider } from 'react-redux'
import { store } from './Redux/App/store'

export default function App() {
  return (
    <>
      <Provider store={store}>
        <AppRoutes/>
      </Provider>
    </>
  )
}
