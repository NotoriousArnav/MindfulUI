"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from "@/config/api"

export default function NoteEditor({ note, onNoteUpdate }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [note_id, setNoteId] = useState("")
  const { toast } = useToast()
  var notification = {}

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content.content)
      setNoteId(note._id)
    } else {
      setTitle("")
      setContent("")
    }
  }, [note])

  const handleSave = () => {
    if (note) {
      onNoteUpdate({
        ...note,
        title,
        content: { content },
        updated_at: new Date().toISOString(),
      })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/notes/${note_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (response.ok) {
        toast({ title: "Success", description: "Note deleted successfully" })
        onUpdate()
      } else {
        throw new Error("Failed to delete note")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete note", variant: "destructive" })
    }
  }

  if (!note) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
        Select a note or create a new one to start editing
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 flex flex-col">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-2xl font-semibold mb-4"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your note here..."
        className="flex-1 resize-none mb-4"
      />
      <div className="text-right space-x-2">
        <Button variant="destructive" onClick={handleDelete}> Delete </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

