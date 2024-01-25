import AuthLayout from '@/concerns/auth/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import * as React from 'react'
import clsx from 'clsx'
import Button, { buttonVariants } from '@/components/button'
import Input from '@/components/input'
import Label from '@/components/label'
import Alert, { AlertDescription, AlertTitle } from '@/components/alert'
import { IconMail } from '@tabler/icons-react'

interface ForgotPasswordProps {}

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = () => {
  const form = useForm({
    email: '',
  })
  const [sent, setSent] = React.useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/auth/forgot_password', {
      onFinish: () => setSent(true),
    })
  }

  return (
    <AuthLayout>
      <Link
        className={clsx(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
        href="/auth/sign_in"
      >
        Sign In
      </Link>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {sent ? (
            <Alert variant="success" id="sent-alert">
              <IconMail className="h-4 w-4 stroke-emerald-600" />
              <AlertTitle>Email Sent</AlertTitle>
              <AlertDescription>
                We've sent you an email with a link to reset your password.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight font-clash">
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a magic link to reset your password.
                </p>
              </div>
              <div className="grid gap-6">
                <form onSubmit={onSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label>Email Address</Label>
                      <Input
                        id="email"
                        placeholder="john.doe@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={form.processing}
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                      />
                    </div>

                    <Button loading={form.processing} type="submit">
                      Send Password Reset Link
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
