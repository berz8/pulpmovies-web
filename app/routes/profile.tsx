import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui";
import { authenticator } from "~/services/auth.server";

import type { User } from "~/interfaces";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { IconSettings } from "~/components/icons";

export const meta: MetaFunction<typeof loader> = ({ data }) => ([
  { title: `@${data?.user.username} - PulpMovies` },
  { property: "og:title", content: `@${data?.user.username} - PulpMovies`},
  { property: "og:description", content: "Discover everything about the movies you love and share them with your friends"},
  { property: "og:image", content: "https://pulpmovies.app/images/pulpmovies-og.jpg"},
  { property: "og:image:width", content: "1200"},
  { property: "og:image:height", content: "675"},
  { property: "og:site_name", content: "PulpMovies" },
])

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user || !user.user) return await authenticator.logout(request, { redirectTo: "/login" });
  const res = await fetch(`${process.env.API_URL}/user/id/${user.user.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
  })
  if(res.status === 401) return await authenticator.logout(request, { redirectTo: "/login" })
  const resJson: User = await res.json();
  if (!resJson.onboarding) return redirect("/onboarding");
  return json({ user: resJson });
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="px-3">
      <div className="py-3 flex justify-between text-gray-300">
        <h1 className="font-bold text-2xl text-gray-200 text-right">
          <span className="opacity-60">@</span>{user.username}
        </h1>
        <Link to="/profile/settings" className="-mr-1">
          <IconSettings />
        </Link>
      </div>
      <div className="flex gap-6 justify-between mt-4">
        <div className="flex gap-3 flex-col justify-between">
          <div className="rounded-full w-20 h-20 bg-gray-300 flex items-center justify-center">
            <span className="font-bold text-[2rem] text-gray-800">
              {`${user.username[0]}${user.username[~~(user.username.length / 2)]}`.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex gap-4 flex-col grow max-w-[400px]">
          <div className="flex gap-6 justify-end">
            <div className="flex flex-col gap-1 justify-end items-end">
              <span className="text-2xl font-bold text-gray-500">0</span>
              <span className="font-semibold text-sm text-gray-300 -mt-1">Watched</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-2xl font-bold text-gray-500">0</span>
              <span className="font-semibold text-sm text-gray-300 -mt-1">Followers</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-2xl font-bold text-gray-500">0</span>
              <span className="font-semibold text-sm text-gray-300 -mt-1">Following</span>
            </div>
          </div>
          <div className="min-w-64">
            <Button text="Edit Profile" type="button" size="sm" variant="transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}
