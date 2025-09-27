import styled from 'styled-components'
import { Button } from './Button'

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'info'
  showRetry?: boolean
  showDismiss?: boolean
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

const ErrorContainer = styled.div<{ type: 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid;

  ${({ type }) => {
    switch (type) {
      case 'error':
        return `
          background-color: #fee;
          border-color: #fcc;
          color: #c33;
        `
      case 'warning':
        return `
          background-color: #fff3cd;
          border-color: #ffeaa7;
          color: #856404;
        `
      case 'info':
        return `
          background-color: #e3f2fd;
          border-color: #bbdefb;
          color: #1565c0;
        `
      default:
        return ''
    }
  }}
`

const MessageContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`

const Icon = styled.span`
  font-size: 1.25rem;
  margin-right: 0.5rem;
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
`

const MessageText = styled.span`
  font-size: 0.875rem;
  line-height: 1.4;
`

export function ErrorMessage({
  message,
  type = 'error',
  showRetry = false,
  showDismiss = true,
  onRetry,
  onDismiss,
  className
}: ErrorMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '❌'
    }
  }

  return (
    <ErrorContainer type={type} className={className} role="alert">
      <MessageContent>
        <Icon aria-hidden="true">{getIcon()}</Icon>
        <MessageText>{message}</MessageText>
      </MessageContent>

      {(showRetry || showDismiss) && (
        <Actions>
          {showRetry && onRetry && (
            <Button
              variant="secondary"
              size="small"
              onClick={onRetry}
              aria-label="Retry"
            >
              Retry
            </Button>
          )}
          {showDismiss && onDismiss && (
            <Button
              variant="ghost"
              size="small"
              onClick={onDismiss}
              aria-label="Dismiss error"
            >
              Dismiss
            </Button>
          )}
        </Actions>
      )}
    </ErrorContainer>
  )
}