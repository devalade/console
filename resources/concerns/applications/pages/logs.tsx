import Ansi from '@curvenote/ansi-to-react'
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import ApplicationLayout from '../application_layout'

interface LogsProps {
  project: Project
  application: Application
}

const Logs: React.FunctionComponent<LogsProps> = ({ project, application }) => {
  const [logs, setLogs] = React.useState<{ time: string; data: string }[]>([])

  React.useEffect(() => {
    let logsEventSource: EventSource

    const initializeLogsEventSource = () => {
      logsEventSource = new EventSource(
        `/projects/${project.slug}/applications/${application.slug}/logs/stream?initialLogs=true`
      )

      logsEventSource.onmessage = (event) => {
        try {
          const date = new Date(event.data.split(' ')[0])
          const time = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
            .format(date)
            .toString()

          setLogs((prevLogs) => [
            ...prevLogs,
            { time, data: event.data.split(' ').slice(1).join(' ') },
          ])
        } catch (error) {
          console.error(error)
        }
      }
    }

    initializeLogsEventSource()

    return () => {
      if (logsEventSource) {
        logsEventSource.close()
      }
    }
  }, [project.slug, application.slug])

  return (
    <ApplicationLayout project={project} application={application}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="min-h-8 max-h-96 overflow-y-auto font-mono text-sm" id="logs-container">
            {logs.map((log, index) => (
              <li key={index}>
                <span className="mr-4">{log.time}</span>
                <Ansi>{log.data}</Ansi>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

export default Logs
