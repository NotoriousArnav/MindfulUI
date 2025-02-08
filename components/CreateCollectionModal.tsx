"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from "@/config/api"

export default function CreateCollectionModal({ isOpen, onClose, onCollectionCreated }) {
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Collection created successfully" })
        onCollectionCreated()
        onClose()
      } else {
        throw new Error("Failed to create collection")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create collection", variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <Button type="submit">Create Collection</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

