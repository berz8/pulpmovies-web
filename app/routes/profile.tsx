import { Form, Outlet } from "@remix-run/react";

export default function Profile() {
  return (
    <div className="px-3 mt-8">
      <h1 className="text-2xl">Username</h1>
    <div className="mt-20">
      <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>
    </div>
      <Outlet />
    </div>
  )
}
