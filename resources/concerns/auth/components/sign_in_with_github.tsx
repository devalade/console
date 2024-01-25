import * as React from 'react'
import clsx from 'clsx'
import { buttonVariants } from '@/components/button'
import { IconBrandGithub } from '@tabler/icons-react'
import Spinner from '@/components/spinner'

interface SignInWithGitHubProps {}

const SignInWithGitHub: React.FunctionComponent<SignInWithGitHubProps> = () => {
  const [signingInWithGithub, setSigningInWithGithub] = React.useState<boolean>(false)
  return (
    <>
      <a
        className={clsx(
          buttonVariants({ variant: 'outline' }),
          signingInWithGithub && 'pointer-events-none opacity-50'
        )}
        href="/auth/github/redirect"
        onClick={() => setSigningInWithGithub(true)}
      >
        {signingInWithGithub ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <IconBrandGithub className="w-5 h-5" />
        )}

        <span>Sign in with GitHub</span>
      </a>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>
    </>
  )
}

export default SignInWithGitHub
