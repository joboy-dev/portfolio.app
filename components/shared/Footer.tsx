import Logo from "./Logo"

function Footer() {
  return (
    <footer className='w-full min-h-[80px] bg-background'>
        <div className="md:px-[120px] md:flex-row px-12 py-8 flex flex-col gap-5 items-center justify-between">
            <Logo />
            <p className="text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} Joboy-Dev. All rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer