"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CreateNoteModal from "./CreateNoteModal"

export default function NoteExplorer({ notes, onNoteSelect, onNoteCreate, selectedCollection }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          // Only show note from selected collection
          selectedCollection && note.collection !== selectedCollection._id ? null :
          <button
            key={note._id}
            className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => onNoteSelect(note)}
          >
            {note.title}
          </button>
        ))}
      </div>
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNoteCreated={onNoteCreate}
        collection={selectedCollection}
      />
    </div>
  )
}

