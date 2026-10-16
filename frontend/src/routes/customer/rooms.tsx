import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/rooms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/customer/rooms"!</div>
}
