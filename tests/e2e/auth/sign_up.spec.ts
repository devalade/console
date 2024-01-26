import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

test.group('Auth / Sign up', () => {
  test('should return an error if the full name is too short', async ({ assert, visit }) => {
    const page = await visit('/auth/sign_up')
    await page.locator('#fullName').fill('Jo')
    await page.locator('#email').fill('john.doe@example.com')
    await page.locator('#password').fill('password')
    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#fullName-error')

    assert.isTrue(await page.isVisible('#fullName-error'))
  })

  test('should return an error if the password is too short', async ({ assert, visit }) => {
    const page = await visit('/auth/sign_up')
    await page.locator('#fullName').fill('John Doe')
    await page.locator('#email').fill(faker.internet.email())
    await page.locator('#password').fill('short')
    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#password-error')

    assert.isTrue(await page.isVisible('#password-error'))
  })

  test('should return an error if the email is already in use', async ({ assert, visit }) => {
    const user = await UserFactory.create()

    const page = await visit('/auth/sign_up')
    await page.locator('#fullName').fill('John Doe')
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill('password')

    await page.locator('button[type=submit]').click()

    await page.waitForSelector('#email-error')

    assert.isTrue(await page.isVisible('#email-error'))
  })

  test('should return to /projects if the sign up process is successful', async ({ visit }) => {
    await visit('/auth/sign_up')

    const page = await visit('/auth/sign_up')
    await page.locator('#fullName').fill(faker.person.fullName())
    await page.locator('#email').fill(faker.internet.email())
    await page.locator('#password').fill(faker.internet.password())

    await page.locator('button[type=submit]').click()

    await page.waitForURL('/projects')
  })
})
