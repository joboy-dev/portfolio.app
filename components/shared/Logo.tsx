import Link from 'next/link';

function Logo({isCollapsed=false}: {isCollapsed?: boolean}) {
  return (
    <Link href="/" className="flex items-center gap-3 w-fit">
      <div className="h-10 w-10 shrink-0 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg p-2">
        <p className="text-xl font-bold text-white">OA</p>
      </div>
      {!isCollapsed && <div>
        <p className="text-xl font-bold text-foreground leading-tight">Joboy.dev</p>
        <p className="text-sm font-normal text-primary leading-tight">Software Developer</p>
      </div> }
    </Link>
  )
}

export default Logo
