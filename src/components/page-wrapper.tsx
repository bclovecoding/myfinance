'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  onAddNew?: () => void
}

export default function PageWrapper({ title, children, onAddNew }: Props) {
  const onAddNewClick = () => {
    onAddNew?.()
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
          <Button
            className="w-full lg:w-auto"
            onClick={onAddNewClick}
            size="sm"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
