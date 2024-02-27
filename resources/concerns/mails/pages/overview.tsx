import * as React from 'react'
import MailsLayout from '../mails_layout'
import Button from '@/components/button'
import { IconKey, IconWorldWww } from '@tabler/icons-react'
import Code from '@/components/code'
import { Link, useForm } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import type { MailApiKey } from '@/concerns/mail_api_keys/types'
import CopyToClipboard from '@/components/copy_to_clipboard'
import Input from '@/components/input'

interface OverviewProps { }

const codeTemplates = [
  `import Facteur from '@softwarecitadel/mails';

async function sendSomeEmail() {
  const facteur = new Facteur('sc-...');

  await facteur.sendEmail({
    from: 'no-reply@example.com',
    to: 'ayn@rand.com',
    subject: 'Who is John Galt?',
    text:
      'I started my life with a single absolute: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.',
    html:
      '<p>I started my life with <b>a single absolute</b>: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.</p>',
  });
}
sendSomeEmail();`,
  `import facteur

f = facteur.Facteur("sc-...")
f.send_email(
    frm='no-reply@example.com',
    to='ayn@rand.com',
    subject='Who is John Galt?',
    text='I started my life with a single absolute: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.',
    html='<p>I started my life with <b>a single absolute</b>: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.</p>',
)`,
  `package main

import "github.com/facteurdev/facteur-go"

func main() {
  payload := &facteur.SendEmailPayload{
      From: "no-reply@example.com",
      To: "ayn@rand.com",
      Subject: "Who is John Galt? From Golang!",
      Text: "I started my life with a single absolute: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.",
      HTML: "<p>I started my life with <b>a single absolute</b>: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.</p>",
  }

  f := facteur.NewFacteur("sc-...")
  err := f.SendEmail(payload)
  if err != nil {
    fmt.Println(err)
  }
}`,
  `use FacteurDev\FacteurPhp\Facteur;

$facteur = new Facteur('sc-...');

try {
    $facteur->sendEmail([
        'from' => 'hank@rearden.com',
        'to' => 'dagny@taggart.com',
        'subject' => 'Who is John Galt?',
        'text' => 'I started my life with a single absolute: that the world was mine to shape in the image of my highest values and never to be given up to a lesser standard, no matter how long or hard the struggle.',
        'html' => "<h1>it <u>works</u>!</h1>"
    ]);
} catch (Exception $e) {
    echo $e->getMessage();
}`,
]

const Overview: React.FunctionComponent<OverviewProps> = () => {
  const runtimes = ['JavaScript', 'Python', 'Go', 'PHP']
  const params = useParams()
  const [selectedRuntime, setSelectedRuntime] = React.useState<string>('JavaScript')

  const [apiKey, setApiKey] = React.useState<string>('')
  const [apiKeyFormLoading, setApiKeyFormLoading] = React.useState<boolean>(false)

  const codeString = apiKey
    ? codeTemplates[runtimes.indexOf(selectedRuntime)].replace('sc-...', apiKey)
    : codeTemplates[runtimes.indexOf(selectedRuntime)]

  const handleAddApiKeySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setApiKeyFormLoading(true)
    try {
      const response = await fetch(
        `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_api_keys`,
        {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: 'Onboarding' }),
        }
      )
      const data = (await response.json()) as MailApiKey
      setApiKey(data.value)
    } catch (error) {
      alert('An error occurred while adding the API key.' + error)
    }
    setApiKeyFormLoading(false)
  }

  return (
    <MailsLayout>
      <h1 className="font-clash font-semibold text-3xl">Send your first email</h1>
      <p className="mt-2 text-zinc-800 text-sm">Follow theses steps to send your first email.</p>

      <div className="relative py-6 my-6">
        <div
          className="absolute top-0 h-[800px] w-[1px]"
          style={{
            background: 'linear-gradient(180deg,transparent,#404040 10%,#404040 90%,transparent)',
          }}
        ></div>

        <div className="relative pl-6 transition duration-200 ease-in-out">
          <div className="absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full">
            <div className="ml-1 mt-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out border-white bg-primary "></div>
          </div>
          <div className="rounded-xl bg-gradient-to-r via-root to-root p-0.5 transition duration-200 ease-in-out">
            <div className="rounded-[10px] bg-root">
              <form
                className="rounded-[10px] bg-gradient-to-r via-green-1 to-green-1 p-6"
                onSubmit={handleAddApiKeySubmit}
              >
                <div className="flex items-center gap-2">
                  <h3 className="mb-1 text-xl tracking-[-0.16px] text-zinc-900 font-bold">
                    Add an API key
                  </h3>
                </div>
                <p className="mb-6 text-sm text-zinc-900 font-normal">
                  API keys are used to access the mails API. You can create or revoke them at any
                  time.
                </p>

                {apiKey ? (
                  <div className="flex !w-auto">
                    <Input
                      className="!rounded-r-none !w-auto !text-zinc-700"
                      value={apiKey}
                      readOnly
                    />
                    <CopyToClipboard value={apiKey} />
                  </div>
                ) : (
                  <Button size="sm" loading={apiKeyFormLoading} type="submit">
                    <IconKey className="w-4 h-4" />
                    <span>Add an API key</span>
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="relative pl-6 transition duration-200 ease-in-out">
          <div className="absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full">
            <div className="ml-1 mt-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out border-white bg-primary "></div>
          </div>
          <div className="rounded-xl bg-gradient-to-r via-root to-root p-0.5 transition duration-200 ease-in-out">
            <div className="rounded-[10px] bg-root">
              <div className="rounded-[10px] bg-gradient-to-r via-green-1 to-green-1 p-6">
                <div className="flex items-center gap-2">
                  <h3 className="mb-1 text-xl tracking-[-0.16px] text-zinc-900 font-bold">
                    Configure your domain
                  </h3>
                </div>
                <p className="mb-6 text-sm text-zinc-900 font-normal">
                  Configure your domain to send emails.
                </p>

                <Link
                  href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_domains`}
                >
                  <Button size="sm">
                    <IconWorldWww className="w-4 h-4" />
                    <span>Configure your domain →</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pl-6 transition duration-200 ease-in-out">
          <div className="absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full">
            <div className="ml-1 mt-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out border-white bg-primary "></div>
          </div>
          <div className="rounded-xl bg-gradient-to-r via-root to-root p-0.5 transition duration-200 ease-in-out">
            <div className="rounded-[10px] bg-root">
              <div className="rounded-[10px] bg-gradient-to-r via-green-1 to-green-1 p-6">
                <div className="flex items-center gap-2">
                  <h3 className="mb-1 text-xl tracking-[-0.16px] text-zinc-900 font-bold">
                    Send an email
                  </h3>
                </div>
                <p className="mb-6 text-sm text-zinc-900 font-normal">
                  Send an email to test your configuration.
                </p>
                <Code
                  runtimes={runtimes}
                  codeString={codeString}
                  selectedRuntime={selectedRuntime}
                  setSelectedRuntime={setSelectedRuntime}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MailsLayout>
  )
}

export default Overview
