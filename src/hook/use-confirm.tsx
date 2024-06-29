'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ReturnType = [
  ConfirmationDialog: () => JSX.Element,
  confirm: () => Promise<unknown>
]

const useConfirm = (
  title = 'Confirm',
  message = 'Are you sure to do this?'
): ReturnType => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="outline">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [ConfirmationDialog, confirm]
}

export default useConfirm
