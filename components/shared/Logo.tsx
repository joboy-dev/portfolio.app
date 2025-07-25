import { Code2 } from 'lucide-react';
import Link from 'next/link';

function Logo({isCollapsed=false}: {isCollapsed?: boolean}) {
  return (
    <Link href="/" className="flex items-center justify-between gap-4">
      <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg">
        <Code2 className="h-7 w-7 text-white" />
      </div>
      {!isCollapsed && <div className='ml-4'>
        <p className="text-xl font-bold">Joboy-Dev</p>
        <p className="text-sm font-normal text-primary">Software Developer</p>
      </div> }
    </Link>
  )
}

export default Logo