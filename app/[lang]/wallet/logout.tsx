'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function Logout() {
  const router = useRouter();

  return (
    <div className='text-center py-10'>
      <button className='btn btn-circle mr-4' onDoubleClick={() => router.back()}>
        <svg viewBox='0 0 512 512' className='fill-current' xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={48}
            d='M244 400L100 256l144-144M120 256h292'
          />
        </svg>
      </button>
      <button className='btn btn-circle' onDoubleClick={() => signOut()}>
        <svg className='fill-current' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 512 512'>
          <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
        </svg>
      </button>
    </div>
  );
}
