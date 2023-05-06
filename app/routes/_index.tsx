import type { V2_MetaFunction } from "@remix-run/node";
import { Logo, Naming } from "../../components/branding"

export const meta: V2_MetaFunction = () => {
  return [{ title: "PulpMovies" }];
};

export default function Index() {
  return (
    <div className="h-full pt-4 pb-24 px-3">
      <div className="flex justify-center items-center gap-2 mb-8">
        <Logo width="2.8rem" />
        <Naming width="12rem" />
      </div>
    </div>
  );
}
