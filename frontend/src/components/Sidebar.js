import React from "react";
import { Clock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

export default function Sidebar({
  currentConversationId,
  onConversationSelect,
}) {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      // Fetch conversations
      const fetchConversations = async () => {
        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (!error) {
          setConversations(data);
        }
      };

      fetchConversations();

      // Subscribe to changes
      const channel = supabase
        .channel("conversations_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchConversations()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleDeleteClick = (e, conversation) => {
    e.stopPropagation(); // Prevent conversation selection
    setConversationToDelete(conversation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        const { error } = await supabase
          .from("conversations")
          .delete()
          .eq("conversation_id", conversationToDelete.conversation_id);

        if (error) throw error;

        // Fetch conversations immediately after deletion
        const { data: updatedConversations } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        setConversations(updatedConversations || []);

        onConversationSelect(null);

        setShowDeleteModal(false);
        setConversationToDelete(null);
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }
  };

  return (
    <div className="w-[280px] lg:w-64 bg-harvey-sidebar flex flex-col h-full">
      {/* Fixed Header */}
      <div className="p-4">
        <h2 className="text-gray-300 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-300" />
          Recent Chats
        </h2>
      </div>

      {/* Scrollable Conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.conversation_id}
              onClick={() => onConversationSelect(conversation)}
              className={`w-full text-left px-2 py-3 rounded transition-colors group relative ${
                currentConversationId === conversation.conversation_id
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="truncate text-sm">{conversation.title}</div>
              <div className="text-xs mt-1 text-gray-500">
                {new Date(conversation.updated_at).toLocaleDateString()}{" "}
                {new Date(conversation.updated_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <button
                onClick={(e) => handleDeleteClick(e, conversation)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                         text-gray-500 hover:text-gray-300 transition-all p-1"
                aria-label="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </div>
  );
}
