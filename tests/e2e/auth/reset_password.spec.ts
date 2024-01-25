import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import router from '@adonisjs/core/services/router'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth / Reset password', () => {
  test('should be redirected to the forgot password page if the token is invalid', async ({
    visit,
  }) => {
    const email = faker.internet.email()
    const page = await visit(`/auth/reset_password/${email}?signature=invalid`)
    await page.waitForURL('/auth/forgot_password')
  })

  test('should return an error if the password is too short', async ({ assert, visit }) => {
    const url = router
      .builder()
      .params({ email: faker.internet.email() })
      .makeSigned('/auth/reset_password/:email', { expiresIn: '30m' })
    const page = await visit(url)
    await page.locator('#newPassword').fill('short')
    await page.locator('#confirmPassword').fill('short')
    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#newPassword-error')

    assert.isTrue(await page.isVisible('#newPassword-error'))
  })

  test('should return an error the passwords do not match', async ({ assert, visit }) => {
    const url = router
      .builder()
      .params({ email: faker.internet.email() })
      .makeSigned('/auth/reset_password/:email', { expiresIn: '30m' })

    const page = await visit(url)
    await page.locator('#newPassword').fill(faker.internet.password())
    await page.locator('#newPassword').fill('some-other-password')
    await page.locator('button[type=submit]').click()

    // Check that we see the error message
    await page.waitForSelector('#newPassword-error')

    assert.isTrue(await page.isVisible('#newPassword-error'))
  })

  test('should reset password if the token and passwords are valid', async ({ assert, visit }) => {
    const user = await UserFactory.create()
    const url = router
      .builder()
      .params({ email: user.email })
      .makeSigned('/auth/reset_password/:email', { expiresIn: '30m' })
    const page = await visit(url)

    // We fill in the form and submit it with a new password
    const newPassword = faker.internet.password()
    await page.locator('#newPassword').fill(newPassword)
    await page.locator('#confirmPassword').fill(newPassword)
    await page.locator('button[type=submit]').click()

    // Check that we see the success message
    await page.waitForSelector('#reset-alert')

    assert.isTrue(await page.isVisible('#reset-alert'))

    // We try to sign in with the new password
    await page.locator('#reset-alert a').click()

    await page.waitForURL('/auth/sign_in')

    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill(newPassword)
    await page.locator('button[type=submit]').click()

    await page.waitForURL('/settings')
  })
})
