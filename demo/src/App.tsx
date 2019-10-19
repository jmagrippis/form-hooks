import React from 'react'
import { useForm } from 'use-form'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const App = () => {
  const fields = {
    email: {
      validations: [EMAIL_REGEX],
    },
  }
  const {
    fields: { email },
  } = useForm({ fields })

  return (
    <form onSubmit={() => {}}>
      <input
        type="email"
        placeholder="email"
        value={email.value}
        onChange={({ currentTarget }) => email.set(currentTarget.value)}
        onBlur={() => email.validate()}
      />
    </form>
  )
}

export default App
