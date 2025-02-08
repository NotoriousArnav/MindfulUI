"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import EditNoteModal from "./EditNoteModal"
import { API_URL } from "@/config/api"

export default function NoteList({ notes, onUpdate }) {
  const [editingNote, setEditingNote] = useState(null)
  const { toast } = useToast()

  const handleDelete = async (noteId) => {
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
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

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note._id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
          <p className="text-gray-600 mb-4">{note.content.content.substring(0, 100)}...</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingNote(note)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(note._id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onNoteUpdated={onUpdate}
        />
      )}
    </div>
  )
}

