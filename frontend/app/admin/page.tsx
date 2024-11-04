'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifiez le rôle de l'utilisateur ici (vous devrez implémenter cette logique)
    const userRole = 'admin' // Remplacez ceci par la vraie logique de vérification du rôle
    if (userRole !== 'admin') {
      router.push('/unauthorized')
    }
  }, [router])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Page Admin</h2>
      <p>Bienvenue sur la page réservée aux administrateurs.</p>
    </div>
  )
}