export type NewDataState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export type OpenDataState = {
  id?: string
  isOpen: boolean
  onOpen: (id:string) => void
  onClose: () => void
}
