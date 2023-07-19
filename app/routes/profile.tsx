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
      <div className="-mx-3 px-3 py-2 flex justify-end text-gray-300 bg-[rgba(0,0,0,0.4)] shadow-xl">
        <Link to="/profile/settings" className="-mr-1">
          <IconSettings />
        </Link>
      </div>
      <div className="flex gap-6 justify-between mt-4">
        <div className="flex gap-3 flex-col justify-between basis-1/2">
          <div className="rounded-full w-28 h-28 bg-gray-300 flex items-center justify-center">
           <span className="font-bold text-[2.5rem] text-gray-800">
            {`${user.username[0]}${user.username[~~(user.username.length/2)]}`.toUpperCase()}</span>
          </div>
          <div className="min-w-64">
            <Button text="Edit Profile" type="button" size="sm" style="transparent" />
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="font-bold text-2xl text-gray-300 text-right"><span className="opacity-3">@</span>{user.username}</h1>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 justify-end items-end">
              <span className="text-[2.5rem] leading-[2.5rem] font-bold text-gray-500">0</span>
              <span className="font-semibold text-sm text-gray-300 -mt-1">Watched</span>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 items-end">
                <span className="text-2xl font-bold text-gray-500">0</span>
                <span className="font-semibold text-sm text-gray-300 -mt-1">Followers</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-2xl font-bold text-gray-500">0</span>
                <span className="font-semibold text-sm text-gray-300 -mt-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
