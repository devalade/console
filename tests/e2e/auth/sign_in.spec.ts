import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

test.group('Auth / Sign in', () => {
  test('should return an error if the email is not registered', async ({ assert, visit }) => {
    const page = await visit('/auth/sign_in')
    await page.locator('#email').fill('nonexistentuser@example.com')
    await page.locator('#password').fill('password')
    await page.locator('button[type=submit]').click()
    await page.waitForSelector('#auth-error')

    assert.isTrue(await page.isVisible('#auth-error'))
  })

  test('should return an error if the password is incorrect', async ({ assert, visit }) => {
    const user = await UserFactory.create()

    const page = await visit('/auth/sign_in')
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill('wrongpassword')

    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#auth-error')

    assert.isTrue(await page.isVisible('#auth-error'))
  })

  test('should redirect to /projects if the sign in process is successful', async ({ visit }) => {
    const password = faker.internet.password()
    const user = await UserFactory.merge({ password }).create()
    const page = await visit('/auth/sign_in')
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill(password)

    await page.locator('button[type=submit]').click()
    await page.waitForURL(/\/organizations\/.*\/projects/)
  })
})
