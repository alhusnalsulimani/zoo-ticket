import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Register from './Register'
import { BrowserRouter } from 'react-router-dom'

describe('Register Component Test', () => {

  it('renders username input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText(/enter full name/i)
    expect(input).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText(/enter email/i)
    expect(input).toBeInTheDocument()
  })

  it('renders phone input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText(/enter phone number/i)
    expect(input).toBeInTheDocument()
  })

  it('renders password input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText(/create a strong password/i)
    expect(input).toBeInTheDocument()
  })

  it('renders register button', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const button = screen.getByRole('button', {
      name: /start my adventure/i,
    })

    expect(button).toBeInTheDocument()
  })

})