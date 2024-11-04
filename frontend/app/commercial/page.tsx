'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CommercialPage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifiez le rôle de l'utilisateur ici (vous devrez implémenter cette logique)
    const userRole = 'commercial' // Remplacez ceci par la vraie logique de vérification du rôle
    if (userRole !== 'commercial') {
      router.push('/unauthorized')
    }
  }, [router])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Page Commerciale</h2>
      <p>Bienvenue sur la page réservée aux commerciaux.</p>
    </div>
  )
}