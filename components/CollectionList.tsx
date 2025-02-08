"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import EditCollectionModal from "./EditCollectionModal"
import { API_URL } from "@/config/api"

export default function CollectionList({ collections, onUpdate }) {
  const [editingCollection, setEditingCollection] = useState(null)
  const { toast } = useToast()

  const handleDelete = async (collectionId) => {
    try {
      const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (response.ok) {
        toast({ title: "Success", description: "Collection deleted successfully" })
        onUpdate()
      } else {
        throw new Error("Failed to delete collection")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete collection", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <div key={collection._id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">{collection.title}</h3>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingCollection(collection)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(collection._id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
      {editingCollection && (
        <EditCollectionModal
          collection={editingCollection}
          isOpen={!!editingCollection}
          onClose={() => setEditingCollection(null)}
          onCollectionUpdated={onUpdate}
        />
      )}
    </div>
  )
}

