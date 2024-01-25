import * as React from 'react'

interface ShowProps {}

const Show: React.FunctionComponent<ShowProps> = () => {
  return (
    <div>
      <p>Settings</p>
      <form action="/auth/sign_out" method="post">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}

export default Show
