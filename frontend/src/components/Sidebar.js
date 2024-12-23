import React from 'react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ currentConversationId, onConversationSelect }) {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Fetch conversations
      const fetchConversations = async () => {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error) {
          setConversations(data);
        }
      };

      fetchConversations();

      // Subscribe to changes
      const channel = supabase
        .channel('conversations_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'conversations',
            filter: `user_id=eq.${user.id}`
          }, 
          () => fetchConversations()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <div className="w-64 bg-eco-darker border-r border-eco-dark flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="p-4 border-b border-eco-dark">
        <h2 className="font-code text-eco-text text-sm mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-eco-green" />
          Recent Chats
        </h2>
      </div>
      
      {/* Scrollable Conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.conversation_id}
              onClick={() => onConversationSelect(conversation)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentConversationId === conversation.conversation_id
                  ? 'bg-eco-green/10 text-eco-green border border-eco-green'
                  : 'text-eco-gray hover:text-eco-text hover:bg-eco-black/50'
              }`}
            >
              <div className="font-code truncate">{conversation.title}</div>
              <div className="text-xs mt-1 opacity-70">
                {new Date(conversation.updated_at).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}