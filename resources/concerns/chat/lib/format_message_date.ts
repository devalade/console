export default function formatMessageDate(dateString: string) {
  const date = new Date(dateString)

  /**
   * If the message was sent today, we return the time.
   */
  if (
    date.getDate() === new Date().getDate() &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  ) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  /**
   * If the message was sent yesterday, we return 'Yesterday'.
   */
  if (
    date.getDate() === new Date().getDate() - 1 &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  ) {
    return (
      'Yesterday at ' +
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      })
    )
  }

  /**
   * Otherwise, we return the date with the time.
   */
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
