"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, User, CheckCircle2 } from "lucide-react"

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
}

export function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Save lead to database
      const { error: dbError } = await supabase.from("property_leads").insert([
        {
          property_id: propertyId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        },
      ])

      if (dbError) throw dbError

      // Send email notification
      await fetch("/api/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyTitle,
          ...formData,
        }),
      })

      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao enviar mensagem")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mensagem Enviada!</h3>
          <p className="text-muted-foreground mb-4">Entraremos em contato em breve.</p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Enviar Outra Mensagem
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interessado?</CardTitle>
        <CardDescription>Envie uma mensagem e entraremos em contato</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Gostaria de mais informações sobre este imóvel..."
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
