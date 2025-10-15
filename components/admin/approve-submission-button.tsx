"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ApproveSubmissionButtonProps {
  submission: {
    id: string
    title: string
    description: string
    property_type: string
    price: number
    location: string
    bedrooms: number | null
    bathrooms: number | null
    area_sqm: number | null
  }
}

export function ApproveSubmissionButton({ submission }: ApproveSubmissionButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Create property from submission
      const { error: propertyError } = await supabase.from("properties").insert([
        {
          title: submission.title,
          description: submission.description,
          property_type: submission.property_type,
          price: submission.price,
          location: submission.location,
          bedrooms: submission.bedrooms,
          bathrooms: submission.bathrooms,
          area_sqm: submission.area_sqm,
          status: "available",
        },
      ])

      if (propertyError) throw propertyError

      // Update submission status
      const { error: updateError } = await supabase
        .from("property_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id)

      if (updateError) throw updateError

      router.refresh()
    } catch (error) {
      console.error("Erro ao aprovar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("property_submissions")
        .update({ status: "rejected" })
        .eq("id", submission.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Erro ao rejeitar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleApprove} disabled={isLoading} className="flex-1">
        <Check className="mr-2 h-4 w-4" />
        Aprovar e Publicar
      </Button>
      <Button onClick={handleReject} disabled={isLoading} variant="destructive" className="flex-1">
        <X className="mr-2 h-4 w-4" />
        Rejeitar
      </Button>
    </div>
  )
}
