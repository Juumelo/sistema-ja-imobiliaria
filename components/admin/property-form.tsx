"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"

interface PropertyFormProps {
  property?: {
    id: string
    title: string
    description: string
    property_type: string
    transition_type: string
    price: number
    location: string
    bedrooms: number | null
    bathrooms: number | null
    area_sqm: number | null
    images: string[]
    status: string
    owner_name: string
    owner_email: string
    owner_phone: string
  }
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false) 
  const [locationInput, setLocationInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    property_type: property?.property_type || "sale",
    transition_type: property?.transition_type || "",
    price: property?.price || 0,
    location: property?.location || "",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area_sqm: property?.area_sqm || 0,
    images: property?.images || [],
    status: property?.status || "available",
    owner_name: property?.owner_name || "",
    owner_email: property?.owner_email || "",
    owner_phone: property?.owner_phone || "",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Erro ao fazer upload da imagem")

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer upload")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (locationInput.trim().length < 3) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          locationInput
        )}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}&limit=5`
      )
        .then((response) => response.json())
        .then((result) => {
          setSuggestions(result.features || [])
        })
        .catch((error) => console.error("Erro ao buscar locais:", error))
        .finally(() => setIsLoading(false))
      }, 100) 
        return () => clearTimeout(delayDebounce)
      }, [locationInput])

    const handleSelect = (suggestion: any) => {
      setLocationInput(suggestion.properties.formatted)
      setFormData({ ...formData, location: suggestion.properties.formatted })
      setSuggestions([])
      setShowSuggestions(false)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (property) {
        // Update existing property
        const { error } = await supabase.from("properties").update(formData).eq("id", property.id)

        if (error) throw error
      } else {
        // Create new property
        const { error } = await supabase.from("properties").insert([formData])

        if (error) throw error
      }

      router.push("/admin/properties")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao salvar imóvel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property ? "Editar Imóvel" : "Novo Imóvel"}</CardTitle>
        <CardDescription>Preencha os dados do imóvel</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
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
                placeholder="Descreva o imóvel..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className=" grid gap-2">
                <Label htmlFor="transition_type">Tipo de Imóvel</Label>
                <Select
                  value={formData.transition_type}
                  onValueChange={(value) => setFormData({ ...formData, transition_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Casa</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="comercial-room">Sala Comercial</SelectItem>
                    <SelectItem value="store">Loja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property_type">Tipo de Transação</Label>
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
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="grid gap-2">

              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                required
                value={locationInput}
                onChange={(e) =>           
                  {setLocationInput(e.target.value)
                  
                  setShowSuggestions(true)}}
                autoComplete="off"
                placeholder="Ex: Centro, São Paulo - SP"
              />
              </div>
              <div>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10  bg-white border rounded-lg shadow max-h-60 overflow-auto">
                {suggestions.map((sug, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(sug)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {sug.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number.parseInt(e.target.value) })}
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
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="rented">Alugado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Imagens</Label>
              <div className="grid gap-4">
                {formData.images.length > 0 && (
                  <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Imagem ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                  <Label htmlFor="images">
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploadingImages ? "Fazendo upload..." : "Clique para adicionar imagens"}
                      </span>
                    </div>
                  </Label>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Dados do Proprietário</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="owner_name">Nome Completo</Label>
                      <Input
                        id="owner_name"
                        required
                        placeholder="Seu nome completo"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}

                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="owner_email">Email</Label>
                        <Input
                          id="owner_email"
                          type="email"
                          required
                          placeholder="seu@email.com"
                          value={formData.owner_email}
                          onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="owner_phone">Telefone</Label>
                        <Input
                          id="owner_phone"
                          type="tel"
                          required
                          placeholder="(00) 00000-0000"
                          value={formData.owner_phone}
                          onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading || uploadingImages} className="flex-1">
              {isLoading ? "Salvando..." : property ? "Atualizar Imóvel" : "Criar Imóvel"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
