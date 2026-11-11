import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          Fight Gear Market — étape 1 local demo. One brand per simulated order.
        </p>
        <div className="site-footer__links">
          <Link href="/catalog">Browse catalog</Link>
          <Link href="/commission">Commission calculator</Link>
        </div>
      </div>
    </footer>
  );
}
