import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'

export default function DocumentLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [documents, setDocuments] = useState([]) // This would be populated from your backend

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-montserrat font-bold text-3xl mb-6">Document Library</h1>
      <div className="flex mb-6">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="bg-forest-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green">
          <Filter className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-montserrat font-semibold text-lg mb-2">{doc.title}</h3>
            <p className="text-gray-600 mb-4">{doc.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{doc.date}</span>
              <button className="text-forest-green hover:underline focus:outline-none">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}