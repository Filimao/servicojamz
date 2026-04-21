import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, Conversation } from "@/hooks/useChat";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

const ACTIVE_STATUSES = ["accepted", "in_progress"];

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { conversations, loading: convsLoading } = useConversations();
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [requestParam, setRequestParam] = useState<string | null>(null);
  const activeRequestId = selected?.request_id || requestParam || null;
  const { messages, loading: msgsLoading, sendMessage } = useMessages(activeRequestId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select from URL ?request=
  useEffect(() => {
    const reqId = searchParams.get("request");
    if (!reqId || !user || convsLoading) return;
    const existing = conversations.find((c) => c.request_id === reqId);
    if (existing) { setSelected(existing); return; }
    (async () => {
      const { data: req } = await supabase.from("service_requests").select("client_id, provider_id").eq("id", reqId).single();
      if (!req) return;
      const otherId = req.client_id === user.id ? req.provider_id : req.client_id;
      const { data: p } = await supabase.from("profiles").select("full_name, avatar_url").eq("user_id", otherId).single();
      setRequestParam(reqId);
      setSelected({
        request_id: reqId, other_user_id: otherId,
        other_user_name: p?.full_name || "Utilizador", other_user_avatar: p?.avatar_url || null,
        last_message: "", last_message_at: new Date().toISOString(), unread_count: 0,
      });
    })();
  }, [searchParams, user, conversations, convsLoading]);

  const handleSend = async () => {
    if (!selected || !text.trim()) return;
    await sendMessage(selected.other_user_id, text);
    setText("");
  };

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // Mobile: show thread full-screen when selected
  const showList = !selected;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
        {/* Conversation List */}
        <div className={cn(
          "w-full md:w-80 md:border-r border-border flex flex-col",
          selected ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Mensagens</h2>
          </div>
          <ScrollArea className="flex-1">
            {convsLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">A carregar...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Sem conversas. Envie uma mensagem a partir de um pedido de serviço.
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.request_id}
                  onClick={() => setSelected(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                    selected?.request_id === conv.request_id && "bg-muted"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={conv.other_user_avatar || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials(conv.other_user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-foreground truncate">{conv.other_user_name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {format(new Date(conv.last_message_at), "dd/MM HH:mm", { locale: pt })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Message Thread */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selected ? "hidden md:flex" : "flex"
        )}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Selecione uma conversa
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                <button onClick={() => setSelected(null)} className="md:hidden p-1">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selected.other_user_avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials(selected.other_user_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground">{selected.other_user_name}</span>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {msgsLoading ? (
                  <div className="text-center text-muted-foreground text-sm">A carregar...</div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}>
                            <p>{msg.content}</p>
                            <div className={cn(
                              "flex items-center gap-1 mt-1",
                              isMine ? "justify-end" : "justify-start"
                            )}>
                              <span className="text-[10px] opacity-70">
                                {format(new Date(msg.created_at), "HH:mm")}
                              </span>
                              {isMine && (
                                <span className="text-[10px] opacity-70">
                                  {msg.is_read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border bg-card flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                <Button onClick={handleSend} size="icon" className="shrink-0 min-h-[44px] min-w-[44px]">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}