'use client';

import { ArrowLeft, Globe, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { humanizePath } from '../libs/helper';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // consider / and /home top-level pages
  const isTopLevel =
    pathname === '/' ||
    pathname === '' ||
    pathname === '/home' ||
    pathname === '/landing-page';

  const isTabRoute = pathname === "/home"
    || pathname === '/search'
    || pathname === '/orders'
    || pathname === '/account';

  const title = isTopLevel ? 'Doorrite' : humanizePath(pathname);

  const handleBack = useCallback(() => {
    // try to go back, otherwise push to /home
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/home');
    }
  }, [router]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full ">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          {isTabRoute ? (
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/icon.jpg"
                alt="Doorrite Logo"
                width={28}
                height={28}
                className="rounded-sm"
                priority
              />
            </Link>
          ) : (
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* route title (on sub routes shows page title) */}
          {/* <div className="hidden sm:block">
            <p className="font-semibold text-base">{title}</p>
          </div> */}
        </div>
        <p className="font-bold text-xl">{title}</p>
        <div className='flex items-center justify-center gap-10'>
          <button
            aria-label="Change language"
            className=""
            title="Change language"
          >
            <Globe size={30} />
          </button>
            <Link href="/cart">
              <ShoppingCart size={30} />
            </Link>
        </div>
      </nav>
    </header>
  );
}