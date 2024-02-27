import Button from '@/components/button'
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import * as React from 'react'

interface SteppedDialogProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  steps: React.ReactNode[]
  submitButton: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const SteppedDialog: React.FunctionComponent<SteppedDialogProps> = ({
  title,
  open,
  setOpen,
  steps: rawSteps,
  submitButton,
  onSubmit,
}) => {
  /**
   * Remove any falsy values from the steps array.
   * Especially useful when using isFeatureEnabled to conditionally render steps.
   */
  const steps = rawSteps.filter(Boolean)

  const [currentStep, setCurrentStep] = React.useState(0)

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          {steps[currentStep]}

          <DialogFooter className="justify-between space-x-2">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                <span>Previous</span>
              </Button>
            ) : (
              <div></div>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNextStep} variant="outline">
                <span>Next</span>
              </Button>
            ) : (
              submitButton
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SteppedDialog
