import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Conversation {
  request_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get all messages where user is sender or receiver
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!messages || messages.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Group by request_id
    const grouped = new Map<string, Message[]>();
    for (const msg of messages) {
      if (!grouped.has(msg.request_id)) grouped.set(msg.request_id, []);
      grouped.get(msg.request_id)!.push(msg);
    }

    // Build conversations
    const otherUserIds = new Set<string>();
    grouped.forEach((msgs) => {
      msgs.forEach((m) => {
        if (m.sender_id !== user.id) otherUserIds.add(m.sender_id);
        if (m.receiver_id !== user.id) otherUserIds.add(m.receiver_id);
      });
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", Array.from(otherUserIds));

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const convs: Conversation[] = [];
    grouped.forEach((msgs, requestId) => {
      const lastMsg = msgs[0];
      const otherId = lastMsg.sender_id === user.id ? lastMsg.receiver_id : lastMsg.sender_id;
      const profile = profileMap.get(otherId);
      const unread = msgs.filter((m) => m.receiver_id === user.id && !m.is_read).length;

      convs.push({
        request_id: requestId,
        other_user_id: otherId,
        other_user_name: profile?.full_name || "Utilizador",
        other_user_avatar: profile?.avatar_url || null,
        last_message: lastMsg.content,
        last_message_at: lastMsg.created_at,
        unread_count: unread,
      });
    });

    convs.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
    setConversations(convs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useMessages(requestId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!requestId || !user) { setMessages([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);
    setLoading(false);

    // Mark unread as read
    if (data && data.length > 0) {
      const unreadIds = data.filter((m) => m.receiver_id === user.id && !m.is_read).map((m) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ is_read: true }).in("id", unreadIds);
      }
    }
  }, [requestId, user]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime
  useEffect(() => {
    if (!requestId || !user) return;
    const channel = supabase
      .channel(`chat-${requestId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `request_id=eq.${requestId}` }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => [...prev, newMsg]);
        if (newMsg.receiver_id === user.id) {
          supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id).then();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [requestId, user]);

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!requestId || !user || !content.trim()) return;
    await supabase.from("messages").insert({
      request_id: requestId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
    });
  }, [requestId, user]);

  return { messages, loading, sendMessage };
}

export function useTotalUnread() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const fetch = useCallback(async () => {
    if (!user) return;
    const { count: c } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("is_read", false);
    setCount(c || 0);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("unread-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetch]);

  return count;
}