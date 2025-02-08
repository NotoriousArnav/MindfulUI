"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from "@/config/api"

export default function EditNoteModal({ note, isOpen, onClose, onNoteUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    collection: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content.content,
        collection: note.collection || "",
      })
    }
  }, [note])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          content: { content: formData.content },
          updated_at: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Note updated successfully" })
        onNoteUpdated()
        onClose()
      } else {
        throw new Error("Failed to update note")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update note", variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="collection">Collection</Label>
            <Select
              name="collection"
              value={formData.collection}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, collection: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">No Collection</SelectItem>
                {/* Add collection options here */}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Update Note</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

