import { useOpenData as useOpenAccount } from '@/features/accounts/useHooks'

type Props = {
  account: string
  accountId: string
}

export default function AccountColumn({ account, accountId }: Props) {
  const { onOpen: onOpenAccount } = useOpenAccount()
  const onClick = () => {
    onOpenAccount(accountId)
  }
  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  )
}
