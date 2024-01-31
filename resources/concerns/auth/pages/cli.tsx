import Alert, { AlertTitle } from '@/components/alert'
import Button from '@/components/button'
import useUser from '@/hooks/use_user'
import AuthLayout from '@/layouts/auth_layout'
import { useForm } from '@inertiajs/react'
import { IconCheck, IconCircleCheck } from '@tabler/icons-react'
import * as React from 'react'

const Cli = () => {
  const user = useUser()

  const form = useForm({
    email: user.email,
  })

  function continueAs(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(window.location.href)
  }

  return (
    <AuthLayout>
      <div className="flex w-full justify-center items-center">
        {form.wasSuccessful ? (
          <Alert variant="success" className="max-w-xl mx-auto">
            <IconCircleCheck className="h-4 w-4 stroke-emerald-600" />
            <AlertTitle>Successfully authenticated</AlertTitle>
          </Alert>
        ) : (
          <form className="max-w-xl mx-auto" onSubmit={continueAs}>
            <Button type="submit" value="Submit" loading={form.processing} className="w-full">
              Continue as {user.fullName}
            </Button>

            <a
              className="text-center text-sm text-zinc-900 hover:opacity-50 transition mt-3 block"
              href={`/auth/sign_in?next=${window.location.pathname}`}
            >
              Or login with another account
            </a>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default Cli
