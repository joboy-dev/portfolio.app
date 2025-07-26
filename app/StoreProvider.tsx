'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store, AppStore } from '@/lib/redux/store'
import { getProfile } from '@/lib/redux/slices/profile/profile'
import { getSkills } from '@/lib/redux/slices/skill/skill'
import { getServices } from '@/lib/redux/slices/service/service'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store
  }

  useEffect(() => {
    if (storeRef.current) {
      // Dispatch initial data loading after component mounts
      storeRef.current.dispatch(getProfile())
      storeRef.current.dispatch(getSkills({}))
      storeRef.current.dispatch(getServices({}))
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}