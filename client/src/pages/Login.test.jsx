import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Login from './Login'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

describe('Login Component Test', () => {

  it('renders email input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    )

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeInTheDocument()
  })

  it('renders password input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    )

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    )

    const button = screen.getByRole('button', { name: /login/i })
    expect(button).toBeInTheDocument()
  })

})