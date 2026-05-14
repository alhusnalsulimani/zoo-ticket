import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AddTicket from './AddTicket'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ticketReducer from '../../features/ticketSlice'

const store = configureStore({
  reducer: {
    tickets: ticketReducer,
  },
})

describe('AddTicket Component Test', () => {

  it('renders ticket name input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddTicket />
        </BrowserRouter>
      </Provider>
    )

    const input = screen.getByPlaceholderText(/ticket name/i)
    expect(input).toBeInTheDocument()
  })

  it('renders description textarea', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddTicket />
        </BrowserRouter>
      </Provider>
    )

    const textarea = screen.getByPlaceholderText(/description/i)
    expect(textarea).toBeInTheDocument()
  })

  it('renders add ticket button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddTicket />
        </BrowserRouter>
      </Provider>
    )

    const button = screen.getByRole('button', {
      name: /add ticket/i,
    })

    expect(button).toBeInTheDocument()
  })

})