"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Building2, CheckCircle2, ArrowLeft } from "lucide-react"
import LogoHorizontal from "@/components/icons/logoHoriontal"

export default function AnunciarPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "sale",
    price: 0,
    location: "",
    bedrooms: 0,
    bathrooms: 0,
    area_sqm: 0,
    owner_name: "",
    owner_email: "",
    owner_phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Submit property for review
      const { error: dbError } = await supabase.from("property_submissions").insert([formData])

      if (dbError) throw dbError

      // Send email notification to admin
      await fetch("/api/send-submission-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          propertyType: formData.property_type,
          price: formData.price,
          ownerName: formData.owner_name,
          ownerEmail: formData.owner_email,
          ownerPhone: formData.owner_phone,
        }),
      })

      setIsSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao enviar anúncio")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <LogoHorizontal
                fill1="#664C3F"
                fill2="#9A7F71"
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
              <h1 className="text-3xl font-bold mb-4">Anúncio Enviado com Sucesso!</h1>
              <p className="text-muted-foreground mb-8 max-w-md">
                Seu imóvel foi enviado para análise. Nossa equipe irá revisar e entrar em contato em breve.
              </p>
              <div className="flex gap-4">
                <Link href="/">
                  <Button>Voltar para Início</Button>
                </Link>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  Anunciar Outro Imóvel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
<LogoHorizontal 
            fill1="#664C3F"
            fill2="#9A7F71"
            className="h-6 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/imoveis" className="text-sm font-medium hover:text-primary transition-colors">
              Imóveis
            </Link>
            <Link href="/anunciar" className="text-sm font-medium hover:text-primary transition-colors">
              Anunciar Imóvel
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Anuncie Seu Imóvel</h1>
          <p className="text-lg text-muted-foreground">
            Preencha os dados abaixo e nossa equipe entrará em contato para publicar seu anúncio
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Imóvel</CardTitle>
            <CardDescription>Forneça informações detalhadas sobre a propriedade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título do Anúncio</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Apartamento 3 quartos no centro"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o imóvel, suas características, diferenciais..."
                    rows={5}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="property_type">Tipo de Anúncio</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Venda</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Centro, São Paulo - SP"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number.parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number.parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="area_sqm">Área (m²)</Label>
                    <Input
                      id="area_sqm"
                      type="number"
                      step="0.01"
                      value={formData.area_sqm}
                      onChange={(e) => setFormData({ ...formData, area_sqm: Number.parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Seus Dados de Contato</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="owner_name">Nome Completo</Label>
                    <Input
                      id="owner_name"
                      required
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="owner_email">Email</Label>
                      <Input
                        id="owner_email"
                        type="email"
                        required
                        value={formData.owner_email}
                        onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="owner_phone">Telefone</Label>
                      <Input
                        id="owner_phone"
                        type="tel"
                        required
                        value={formData.owner_phone}
                        onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  Ao enviar este formulário, você concorda que nossa equipe entre em contato para validar as informações
                  antes da publicação do anúncio.
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? "Enviando..." : "Enviar Anúncio para Análise"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-background py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 JA Imobiliaria. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
