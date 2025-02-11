import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";

export default function LogoComponent() {
  return (
    <Link href="/" className="w-40 h-10 flex items-center justify-start gap-4">
      <div className="w-16">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/lvllogo.png"
            alt="Image"
            className="object-cover"
            fill
            sizes="(max-width: 600px) 100vw, 60px"
          />
        </AspectRatio>
      </div>
      <h1 className="text-lg font-medium text-green-600">Tỷ Xuân</h1>
    </Link>
  );
}
