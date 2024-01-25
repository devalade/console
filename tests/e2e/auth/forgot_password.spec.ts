import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import mail from '@adonisjs/mail/services/main'
import { UserFactory } from '#database/factories/user_factory'
import ResetPasswordNotification from '#mails/reset_password_notification'
import { BaseMail } from '@adonisjs/mail'

test.group('Auth / Forgot password', () => {
  test('should not send an email if the email address is not registered', async ({ visit }) => {
    const { mails } = mail.fake()

    const page = await visit('/auth/forgot_password')
    await page.locator('#email').fill(faker.internet.email())
    await page.locator('button[type=submit]').click()

    mails.assertNoneSent()
  })

  test('should send an email if the email address is registered', async ({ visit }) => {
    const { mails } = mail.fake()

    const user = await UserFactory.create()

    const page = await visit('/auth/forgot_password')
    await page.locator('#email').fill(user.email)
    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#sent-alert')
    await page.assertExists(page.locator('h5', { hasText: 'Email Sent' }))
    await page.assertExists(
      page.locator('div', {
        hasText: "We've sent you an email with a link to reset your password.",
      })
    )

    mails.assertSent(ResetPasswordNotification as unknown as typeof BaseMail)
  })
})
