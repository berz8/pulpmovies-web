import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui";
import { authenticator } from "~/services/auth.server";

import type { ApiResponse, User } from "~/interfaces";
import type { LoaderArgs } from "@remix-run/node";
import { IconSettings } from "~/components/icons";

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) return redirect("/login");
  const res = await fetch(`${process.env.API_URL}/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token.access_token}`,
    },
  })
  const resJson: ApiResponse<User> = await res.json();
  return json({ user: resJson.result });
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
