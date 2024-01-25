import AuthLayout from '@/concerns/auth/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import * as React from 'react'
import clsx from 'clsx'
import Button, { buttonVariants } from '@/components/button'
import useError from '@/hooks/use_error'
import Input from '@/components/input'
import Label from '@/components/label'
import Alert, { AlertDescription, AlertTitle } from '@/components/alert'

interface ForgotPasswordProps {}

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = () => {
  const form = useForm({
    newPassword: '',
    confirmPassword: '',
  })
  const error = useError('auth')
  const [reset, setReset] = React.useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.post(window.location.href, {
      onSuccess: () => setReset(true),
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
          {reset ? (
            <Alert variant="success" id="reset-alert">
              <AlertTitle>Password Reset</AlertTitle>
              <AlertDescription>
                Your password has been reset. You may now{' '}
                <Link className="link" href="/auth/sign_in">
                  sign in
                </Link>{' '}
                with your new password.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight font-clash">Reset Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter a new password and confirm it to reset your password.
                </p>
              </div>
              <div className="grid gap-6">
                <form onSubmit={onSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label>New Password</Label>
                      <Input
                        id="newPassword"
                        placeholder="••••••••••••"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={form.processing}
                        value={form.data.newPassword}
                        onChange={(e) => form.setData('newPassword', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        placeholder="••••••••••••"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={form.processing}
                        value={form.data.confirmPassword}
                        onChange={(e) => form.setData('confirmPassword', e.target.value)}
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button loading={form.processing} type="submit">
                      Reset Password
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
