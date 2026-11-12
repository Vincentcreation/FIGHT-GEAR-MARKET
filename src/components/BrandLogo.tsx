"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LOGO_PATH = "/branding/fgm-logo.png";

type Props = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Link
        href="/"
        className={`brand-mark brand-mark--fallback${className ? ` ${className}` : ""}`}
      >
        <span className="brand-mark__word">Fight Gear Market</span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`brand-logo${className ? ` ${className}` : ""}`}
      aria-label="Fight Gear Market home"
    >
      <Image
        src={LOGO_PATH}
        alt="Fight Gear Market"
        width={2172}
        height={724}
        className="brand-logo__img"
        priority={priority}
        onError={() => setFailed(true)}
      />
    </Link>
  );
}
