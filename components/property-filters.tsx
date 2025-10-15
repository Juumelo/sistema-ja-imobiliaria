"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "all")

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (type && type !== "all") params.set("type", type)

    router.push(`/imoveis?${params.toString()}`)
  }

  const handleClear = () => {
    setSearch("")
    setType("all")
    router.push("/imoveis")
  }

  return (
    <div className="bg-background rounded-lg border p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar por título ou localização..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="sale">Venda</SelectItem>
            <SelectItem value="rent">Aluguel</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button onClick={handleFilter} className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button onClick={handleClear} variant="outline">
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
