import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { isAuthenticated } from '@/lib/authStore'

export const Route = createFileRoute('/_admin')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: () => <Outlet />,
})
