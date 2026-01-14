import { Code2 } from 'lucide-react';
import Link from 'next/link';

function Logo({isCollapsed=false}: {isCollapsed?: boolean}) {
  return (
    <Link href="/" className="flex items-center justify-between gap-4">
      <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg p-2">
        <p className="text-xl font-bold text-white">OA</p>
      </div>
      {!isCollapsed && <div className='ml-4'>
        <p className="text-xl font-bold">Joboy.dev</p>
        {/* <p className="text-xl font-bold">Oluwakorede Adegbehingbe</p> */}
        <p className="text-sm font-normal text-primary">Software Developer</p>
      </div> }
    </Link>
  )
}

export default Logo