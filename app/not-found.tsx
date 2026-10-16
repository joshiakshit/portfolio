import Link from 'next/link';
import { PageShell } from '@/components/ui/page-shell';

export default function NotFound() {
  return (
    <PageShell
      tag="404  ·  NOT FOUND"
      title="End of the line."
      subtitle={<code>$ cd /that/page — No such file or directory</code>}
      footer={
        <Link href="/" className="portal-primary-btn">
          ← return to main route
        </Link>
      }
    />
  );
}
