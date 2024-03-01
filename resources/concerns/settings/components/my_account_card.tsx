import useUser from '@/hooks/use_user'
import { useForm } from '@inertiajs/react'
import Input from '@/components/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import Label from '@/components/label'
import useSuccessToast from '@/hooks/use_success_toast'
import * as React from 'react'
import Avatar from '@/components/avatar'

export default function MyAccountCard() {
  const user = useUser()
  const successToast = useSuccessToast()
  const userAvatarRef = React.useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = React.useState<string | null>(user.avatarUrl)

  const form = useForm({
    email: user.email,
    fullName: user.fullName,
    newPassword: '',
    confirmPassword: '',
    avatar: null,
  })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setData('avatar', file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.patch('/settings', {
      onSuccess: () => successToast(),
      forceFormData: true,
    })
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent className="px-0 !pt-4 space-y-4 divide-y divide-blue-600/20">
          <div className="space-y-4 px-6">
            <div>
              <Label>Avatar</Label>
              <div className="flex items-center space-x-4">
                <Avatar user={user} hidePresence overrideImage={avatar} />
                <input
                  name="userAvatar"
                  id="userAvatar"
                  type="file"
                  ref={userAvatarRef}
                  accept="image/*"
                  hidden
                  onChange={onFileChange}
                />
                <Button
                  onClick={() => userAvatarRef.current?.click()}
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  Change
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4 px-6 pt-6">
            <div className="grid gap-1">
              <Label>Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={form.data.fullName}
                onChange={(e) => form.setData('fullName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 px-6 pt-6">
            <div className="grid gap-1">
              <Label>
                New Password <span className="text-zinc-700">(optional)</span>
              </Label>
              <Input
                id="newPassword"
                placeholder="••••••••••••"
                type="password"
                value={form.data.newPassword}
                onChange={(e) => form.setData('newPassword', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>
                Confirm Password <span className="text-zinc-700">(optional)</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••••••"
                type="password"
                value={form.data.confirmPassword}
                onChange={(e) => form.setData('confirmPassword', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button loading={form.processing} type="submit">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
