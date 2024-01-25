import AuthLayout from '@/concerns/auth/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import * as React from 'react'
import clsx from 'clsx'
import Button, { buttonVariants } from '@/components/button'
import useError from '@/hooks/use_error'
import Input from '@/components/input'
import Label from '@/components/label'
import SignUpWithGitHub from '@/concerns/auth/components/sign_in_with_github'

interface SignUpProps {}

const SignUp: React.FunctionComponent<SignUpProps> = () => {
  const form = useForm({
    fullName: '',
    email: '',
    password: '',
  })
  const error = useError('auth')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/auth/sign_up')
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
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight font-clash">Create an account</h1>
            <p className="text-sm text-muted-foreground">Sign up for a Software Citadel account.</p>
          </div>
          <div className="grid gap-6">
            <SignUpWithGitHub />

            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label>Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={form.processing}
                    value={form.data.fullName}
                    onChange={(e) => form.setData('fullName', e.target.value)}
                  />
                </div>
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
                <div className="grid gap-1">
                  <Label>Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    disabled={form.processing}
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button loading={form.processing} type="submit">
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignUp
