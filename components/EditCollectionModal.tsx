"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from "@/config/api"

export default function EditCollectionModal({ collection, isOpen, onClose, onCollectionUpdated }) {
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (collection) {
      setTitle(collection.title)
    }
  }, [collection])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/collections/${collection._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          updated_at: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Collection updated successfully" })
        onCollectionUpdated()
        onClose()
      } else {
        throw new Error("Failed to update collection")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update collection", variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <Button type="submit">Update Collection</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

