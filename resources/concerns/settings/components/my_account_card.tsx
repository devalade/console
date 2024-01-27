import React from 'react'
import useUser from '@/hooks/use_user'
import { useToast } from '@/hooks/use_toast'
import { IconCircleCheck } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'
import Input from '@/components/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import Label from '@/components/label'

export default function MyAccountCard() {
  const user = useUser()
  const { toast } = useToast()

  const form = useForm({
    email: user.email,
    fullName: user.full_name,
    newPassword: '',
    confirmPassword: '',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.patch('/settings', {
      onSuccess: () => {
        toast({
          title: (
            <div className="flex items-center space-x-2">
              <IconCircleCheck className="text-blue-600 h-5 w-5" />
              <p>Saved Successfully !</p>
            </div>
          ),
        })
      },
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4 divide-y divide-blue-600/20">
          <div className="space-y-4 px-4">
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

          <div className="space-y-4 px-4 pt-6">
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
