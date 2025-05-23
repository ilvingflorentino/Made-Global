
"use client"
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatbotModal } from './chatbot-modal'
import type { Dictionary } from '@/lib/dictionaries'


export function ChatbotLauncher({ dictionary }: { dictionary: Dictionary['common'] }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Button
        className="fixed bottom-20 right-6 md:bottom-6 md:right-6 rounded-full shadow-lg p-4 h-16 w-16 animate-fade-in bg-[hsl(var(--primary)/0.4)] text-primary-foreground hover:bg-[hsl(var(--primary)/0.5)]"
        onClick={() => setIsChatOpen(true)}
        aria-label={dictionary.chatWithExpert}
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
      <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} dictionary={dictionary} />
    </>
  )
}
