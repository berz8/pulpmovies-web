import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '../services/auth.server'

export let loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return authenticator.authenticate('google', request, {
    successRedirect: user?.user.Onboarding ? '/' : '/onboarding',
    failureRedirect: '/login',
  })
}