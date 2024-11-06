
import Link from 'next/link';

export default function Home() {
  return (
    <main className='font-[var(--font-inter-sans)]'>
      <h1>Welcome to My CRUD App</h1>
      <Link href="/posts">Manage Posts</Link>
    </main>
  );
}
