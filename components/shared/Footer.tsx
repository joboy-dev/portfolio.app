import Logo from "./Logo"

function Footer() {
  return (
    <footer className='w-full min-h-[80px] bg-background'>
        <div className="px-6 sm:px-10 md:px-12 lg:px-40 max-w-420 mx-auto md:flex-row py-8 flex flex-col gap-5 items-center justify-between">
            <Logo />
            <p className="text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} Adegbehingbe Oluwakorede. All rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer