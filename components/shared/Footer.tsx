import Logo from "./Logo"

function Footer() {
  return (
    <footer className='w-full min-h-[80px] bg-background'>
        <div className="nav-padding max-w-420 md:flex-row py-8 flex flex-col gap-5 items-center justify-between">
            <Logo />
            <p className="text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} Adegbehingbe Oluwakorede. All rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer