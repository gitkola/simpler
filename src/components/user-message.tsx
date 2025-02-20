import React from 'react'
import { CollapsibleMessage } from './collapsible-message'

type UserMessageProps = {
  content: Array<{ type: 'text', text: string }> | string
}

export const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  let text = '';
  if (Array.isArray(content)) {
    text = content.join(' ');
  }
  if (typeof content === 'string') {
    text = content;
  }
  return (
    <CollapsibleMessage role="user">
      <div className="flex-1 break-words w-full">{text}</div>
    </CollapsibleMessage>
  )
}
