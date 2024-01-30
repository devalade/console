import type { Project } from '@/concerns/projects/types/project'
import React from 'react'
import type { Application } from '../../types/application'
import type { Certificate } from '../../types/certificates'
import { useForm } from '@inertiajs/react'
import { Card, CardContent, CardHeader } from '@/components/card'
import clsx from 'clsx'
import Button from '@/components/button'
import { IconCircleCheck } from '@tabler/icons-react'
import DnsEntry from './dns_entry'
import DeleteCertificateDialog from './delete_certificate_dialog'

export type CertificateCardProps = {
  project: Project
  application: Application
  certificate: Certificate
}

export default function CertificateCard({
  application,
  project,
  certificate,
}: CertificateCardProps) {
  const [deleteCertificateDialogOpen, setDeleteCertificateDialogOpen] = React.useState(false)
  const checkForm = useForm()

  const checkCertificate = () => {
    const url = `/projects/${project.slug}/applications/${application.slug}/certificates/${certificate.domain}/check`
    checkForm.post(url)
  }

  return (
    <>
      <DeleteCertificateDialog
        certificate={certificate}
        project={project}
        application={application}
        open={deleteCertificateDialogOpen}
        setOpen={setDeleteCertificateDialogOpen}
      />

      <Card className="mt-6">
        <CardHeader className={clsx({ 'border-b-0': certificate.status === 'configured' })}>
          <div className="flex justify-between">
            <a
              className="hover:opacity-75 transition-opacity"
              href={`https://${certificate.domain}`}
              target="_blank"
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{certificate.domain}</span>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </div>
            </a>
            <div className="flex space-x-2 items-center">
              <Button
                type="button"
                variant="outline"
                onClick={checkCertificate}
                loading={checkForm.processing}
              >
                Check
              </Button>

              <Button
                type="submit"
                variant="destructive"
                onClick={() => setDeleteCertificateDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 items-center">
            {certificate.status === 'configured' ? (
              <IconCircleCheck className="w-5 h-5 text-emerald-600" />
            ) : certificate.status === 'pending' ? (
              <svg
                className="w-6 h-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="text-zinc-900 text-sm">
              {certificate.status === 'configured'
                ? 'Valid configuration'
                : 'Invalid configuration'}
            </span>
          </div>
        </CardHeader>
        {certificate.status !== 'configured' && (
          <CardContent>
            <div className="text-zinc-900 text-sm">Add DNS entries</div>
            {certificate.dnsEntries.map((entry, idx) => (
              <DnsEntry key={idx} {...entry} />
            ))}
          </CardContent>
        )}
      </Card>
    </>
  )
}
