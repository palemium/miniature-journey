import styled from 'styled-components'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  'aria-label'?: string
  $marginTop?: string
}

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  $marginTop?: string
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          min-height: 2rem;
        `
      case 'large':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          min-height: 3rem;
        `
      default:
        return `
          padding: 0.5rem 1rem;
          font-size: 1rem;
          min-height: 2.5rem;
        `
    }
  }}

  ${({ $marginTop }) => $marginTop ? `margin-top: ${$marginTop};` : ''}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #007bff;
          color: white;
          border-color: #007bff;

          &:hover:not(:disabled) {
            background-color: #0056b3;
            border-color: #0056b3;
          }

          &:focus:not(:disabled) {
            outline: 2px solid #007bff;
            outline-offset: 2px;
          }
        `
      case 'secondary':
        return `
          background-color: #6c757d;
          color: white;
          border-color: #6c757d;

          &:hover:not(:disabled) {
            background-color: #545b62;
            border-color: #545b62;
          }

          &:focus:not(:disabled) {
            outline: 2px solid #6c757d;
            outline-offset: 2px;
          }
        `
      case 'ghost':
        return `
          background-color: transparent;
          color: #6c757d;
          border-color: transparent;

          &:hover:not(:disabled) {
            background-color: #f8f9fa;
            color: #495057;
          }

          &:focus:not(:disabled) {
            outline: 2px solid #6c757d;
            outline-offset: 2px;
          }
        `
      default:
        return ''
    }
  }}
`

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </StyledButton>
  )
}