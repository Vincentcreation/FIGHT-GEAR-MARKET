import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__name">Fight Gear Market</p>
          <p className="site-footer__note">
            Local demo. One brand per simulated order.
          </p>
        </div>
        <div className="site-footer__links">
          <Link href="/catalog">Browse catalog</Link>
          <Link href="/commission">Commission calculator</Link>
        </div>
      </div>
    </footer>
  );
}
