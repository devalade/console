import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Application } from '../types/application'
import CertificateCard from '../components/certificates/certificate_card'
import AddCertificateForm from '../components/certificates/add_certificate_form'
import ApplicationLayout from '../application_layout'

interface CertificatesProps {
  project: Project
  application: Application
}

const Certificates: React.FunctionComponent<CertificatesProps> = ({ project, application }) => {
  return (
    <ApplicationLayout project={project} application={application}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Certificates management</CardTitle>
        </CardHeader>
        <CardContent className="!px-0">
          <div className="px-6">
            <AddCertificateForm project={project} application={application} />
          </div>

          {application.certificates!.length > 0 && (
            <div className="border-t border-blue-600/20 mt-6 px-6">
              {application.certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  project={project}
                  application={application}
                  certificate={certificate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

export default Certificates
