import * as React from 'react'
import MailsLayout from '../mails_layout'
import Button from '@/components/button'
import { IconKey, IconWorldWww } from '@tabler/icons-react'
import Code from '@/components/code'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'

interface OverviewProps {}

const codeTemplates = [
  `import Facteur from 'facteur-node';

async function sendSomeEmail() {
  const facteur = new Facteur('facteur-...');

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

f = facteur.Facteur("facteur-...")
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

  f := facteur.NewFacteur("<YOUR_API_KEY>")
  err := f.SendEmail(payload)
  if err != nil {
    fmt.Println(err)
  }
}`,
  `use FacteurDev\FacteurPhp\Facteur;

$facteur = new Facteur('<your-api-key>');

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
                action="{{ route('dashboard.api_keys.store') }}"
                className="rounded-[10px] bg-gradient-to-r via-green-1 to-green-1 p-6"
                method="POST"
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

                <Button size="sm">
                  <IconKey className="w-4 h-4" />
                  <span>Add an API key</span>
                </Button>
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
                  href={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mails/domains`}
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
                  codeString={codeTemplates[runtimes.indexOf(selectedRuntime)]}
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
