'use client';

import { Session } from '@/lib/types';
import Button from '@/components/ui/Button';
import { currentUser } from '@/lib/mock-data';
import { User2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface SessionHeaderProps {
  session: Session;
  onEndSession: () => void;
}

export default function SessionHeader({ session, onEndSession }: SessionHeaderProps) {
  const { user } = useUser()

  const other = session?.helper?.id === user?.id ? session.learner : session.helper

  const isHelper = user?.id === session.helperId;
  const actionLabel = isHelper ? 'End Session' : 'Request Help';

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className='rounded-full border border-gray-300'>
          <User2 className='w-12 h-12 p-2 rounded-full object-cover text-gray-300' />
        </div>
        <div>
          <div className="font-medium text-black">{other?.profile?.name ?? 'Participant'}</div>
          <div className="text-xs text-zinc-500">{session.beacon?.title ?? 'No topic'}</div>
        </div>
      </div>

      <div className='flex flex-row gap-2'>
        {/* <Button onClick={() => console.log('action clicked', session.id)} size="sm" variant="outline">
          {actionLabel}
        </Button> */}
        <Button
          variant='danger'
          onClick={onEndSession}
        >
          End Session
        </Button>
      </div>
    </div>
  );
}