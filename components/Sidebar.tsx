"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut } from "lucide-react"
import CreateCollectionModal from "./CreateCollectionModal"

export default function Sidebar({ collections, onCollectionSelect, onCollectionCreate, onLogout }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Collections</h2>
      <div className="flex-1 overflow-y-auto">
        {collections.map((collection) => (
          <button
            key={collection._id}
            className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            onClick={() => onCollectionSelect(collection)}
          >
            {collection.title}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Collection
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCollectionCreated={onCollectionCreate}
      />
    </div>
  )
}

