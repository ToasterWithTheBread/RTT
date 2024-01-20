import { Button } from '@nextui-org/button';

import { BiShareAlt } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";

export default function Home() {
  return (
    <main>
      <div class="h-screen flex items-center justify-center">
        <div className="text-center w-[250px]">
          <div>
            <Button size="lg" color="primary" radius="md" fullWidth variant="shadow" onClick={() => window.location.href = "/share"} startContent={<BiShareAlt />}>Share</Button>
          </div>

          <div className="mt-10">
            <Button size="lg" color="primary" radius="md" fullWidth variant="shadow" onClick={() => window.location.href = "/receive"} startContent={<BiDownload />}>Receive</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
