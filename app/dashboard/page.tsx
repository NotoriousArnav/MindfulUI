"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Sidebar from "@/components/Sidebar"
import NoteExplorer from "@/components/NoteExplorer"
import NoteEditor from "@/components/NoteEditor"
import { API_URL } from "@/config/api"

export default function Dashboard() {
  const [collections, setCollections] = useState([])
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCollections()
  }, [])

  useEffect(() => {
    if (selectedCollection) {
      fetchNotes(selectedCollection._id)
    } else {
      fetchNotes()
    }
  }, [selectedCollection])

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/collections`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      } else {
        throw new Error("Failed to fetch collections")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch collections", variant: "destructive" })
    }
  }

  const fetchNotes = async (collectionId = null) => {
    try {
      const url = collectionId ? `${API_URL}/notes/${collectionId}` : `${API_URL}/notes`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      } else {
        throw new Error("Failed to fetch notes")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch notes", variant: "destructive" })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const handleNoteSelect = (note) => {
    setSelectedNote(note)
  }

  const handleNoteUpdate = async (updatedNote) => {
    try {
      const response = await fetch(`${API_URL}/notes/${updatedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedNote),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Note updated successfully" })
        fetchNotes(selectedCollection?._id)
      } else {
        throw new Error("Failed to update note")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update note", variant: "destructive" })
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        collections={collections}
        onCollectionSelect={setSelectedCollection}
        onCollectionCreate={fetchCollections}
        onLogout={handleLogout}
      />
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-semibold">Mindful Notes</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <NoteExplorer
            notes={notes}
            onNoteSelect={handleNoteSelect}
            onNoteCreate={() => {
              setSelectedNote(null)
              fetchNotes(selectedCollection?._id)
            }}
            selectedCollection={selectedCollection}
          />
          <NoteEditor note={selectedNote} onNoteUpdate={handleNoteUpdate} />
        </div>
      </div>
    </div>
  )
}

