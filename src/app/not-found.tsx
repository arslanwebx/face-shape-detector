import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="not-found"><div><h1>This page could not be found</h1><p>The address may have changed, or the link may be incomplete. Start with the detector or compare the seven face shapes.</p><div className="button-row"><Link className="button" href="/">Go to the detector</Link><Link className="button secondary" href="/face-shapes/">Browse face shapes</Link></div></div></main>;
}
