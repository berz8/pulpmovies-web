import { Form } from "@remix-run/react";
import { Button } from "~/components/ui";

export default function Settings() {
  return (
    <div className="px-3 mt-4">
      <h1 className="text-3xl font-bold text-gray-300">Settings</h1>
      <div className="mt-20">
        <Form action="/logout" method="post">
          <Button type="submit" variant="main" text="Sign Out" />
        </Form>
      </div>
    </div>
  );
}
