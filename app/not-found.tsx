import LinkButton from "@/components/shared/button/LinkButton";
import Eyebrow from "@/components/shared/motion/Eyebrow";
import { ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background text-center px-4">
      <div className="flex flex-col items-center">
        <Eyebrow className="justify-center">404</Eyebrow>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground">This page wandered off.</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-sm font-mono">
          {'return notFound() // the page you\'re looking for doesn\'t exist or moved.'}
        </p>

        <LinkButton
          to="/"
          size='lg'
          variant='primary'
          className="font-bold mt-8"
        >
          <ArrowLeftCircle className='h-5 w-5 mr-3'/>
          Back to home
        </LinkButton>
      </div>
    </div>
  )
}
