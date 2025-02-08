"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from "@/config/api"

export default function CreateNoteModal({ isOpen, onClose, onNoteCreated, collection }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          content: { content },
          collection: collection?._id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Note created successfully" })
        onNoteCreated()
        onClose()
      } else {
        throw new Error("Failed to create note")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create note", variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <Button type="submit">Create Note</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

