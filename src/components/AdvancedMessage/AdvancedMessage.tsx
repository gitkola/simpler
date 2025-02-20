import React, { useState } from 'react';
import { Share, Copy, Check, Trash, Edit, RefreshCw, Flag, MessageSquare, Star, Globe } from 'lucide-react';

// src/components/Message/types.ts
export type MessageAuthor = {
    id: string;
    name: string;
    avatar: string;
    role: 'user' | 'assistant' | 'tool_call' | "tool_result" | 'system';
    badges: string[];
    profileUrl: string;
};

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'error';

export type MessageReaction = {
    emoji: string;
    count: number;
    users: string[];
};

export type MessageContentType = {
    type: 'text' | 'code' | 'image' | 'video' | 'audio' | 'file' | 'link';
    content: string;
    language?: string;
    mimeType?: string;
    fileName?: string;
    fileSize?: number;
    metadata?: Record<string, unknown>;
};

export type MessageThreadType = {
    id: string;
    count: number;
    lastReply: MessageType;
};

export type MessageType = {
    id: string;
    author: MessageAuthor;
    content: MessageContentType[];
    timestamp: string;
    status: MessageStatus;
    reactions: MessageReaction[];
    thread?: MessageThreadType;
    mentions: string[];
    hashtags: string[];
    rating?: number;
    isEdited: boolean;
    scientificTerms?: {
        term: string;
        definition: string;
        confidence: number;
    }[];
};

// src/components/Message/Message.tsx
// import React, { useState } from 'react';
// import { MessageType } from './types';
// import { MessageHeader } from './MessageHeader';
// import { MessageContent } from './MessageContent';
// import { MessageFooter } from './MessageFooter';
// import { MessageControls } from './MessageControls';
// import { MessageThread } from './MessageThread';
// import { AIInsightOverlay } from './AIInsightOverlay';

interface MessageProps {
    message: MessageType;
    onCopy: (messageId: string) => void;
    onRetry: (messageId: string) => void;
    onEdit: (messageId: string) => void;
    onDelete: (messageId: string) => void;
    onShare: (messageId: string) => void;
    onRate: (messageId: string, rating: number) => void;
    onReport: (messageId: string) => void;
    onTranslate: (messageId: string, targetLanguage: string) => void;
    onReact: (messageId: string, emoji: string) => void;
    onReply: (messageId: string) => void;
    className?: string;
}

export const AdvancedMessage: React.FC<MessageProps> = ({
    message,
    onCopy,
    onRetry,
    onEdit,
    onDelete,
    onShare,
    onRate,
    onReport,
    onTranslate,
    onReact,
    onReply,
    className = '',
}) => {
    const [showInsights, setShowInsights] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const messageClasses = `
      relative
      rounded-lg
      p-4
      mb-4
      transition-all
      duration-200
      ${message.author.role === 'assistant' ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'}
      ${message.status === 'error' ? 'border-red-500 border' : ''}
      ${className}
    `;

    return (
        <div
            className={messageClasses}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <MessageHeader author={message.author} timestamp={message.timestamp} />

            <div className="relative">
                <MessageContent
                    content={message.content}
                    scientificTerms={message.scientificTerms}
                    showInsights={showInsights}
                />

                {message.scientificTerms && (
                    <button
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-600"
                        onClick={() => setShowInsights(!showInsights)}
                    >
                        {showInsights ? 'Hide Insights' : 'Show Insights'}
                    </button>
                )}
            </div>

            <MessageFooter
                status={message.status}
                reactions={message.reactions}
                thread={message.thread}
                onReact={emoji => onReact(message.id, emoji)}
            />

            {isHovered && (
                <MessageControls
                    messageId={message.id}
                    onCopy={() => onCopy(message.id)}
                    onRetry={() => onRetry(message.id)}
                    onEdit={() => onEdit(message.id)}
                    onDelete={() => onDelete(message.id)}
                    onShare={() => onShare(message.id)}
                    onRate={rating => onRate(message.id, rating)}
                    onReport={() => onReport(message.id)}
                    onTranslate={targetLanguage => onTranslate(message.id, targetLanguage)}
                    onReply={() => onReply(message.id)}
                />
            )}

            {message.thread && (
                <MessageThread thread={message.thread} />
            )}

            {showInsights && message.scientificTerms && (
                <AIInsightOverlay terms={message.scientificTerms} />
            )}
        </div>
    );
};

// src/components/Message/MessageHeader.tsx
// import React from 'react';
// import { MessageAuthor } from './types';
// import { Badge } from './Badge';

interface MessageHeaderProps {
    author: MessageAuthor;
    timestamp: string;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
    author,
    timestamp,
}) => {
    return (
        <div className="flex items-center gap-3 mb-2">
            <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full"
            />

            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <a
                        href={author.profileUrl}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
                    >
                        {author.name}
                    </a>
                    <span className="text-sm text-gray-500">
                        {new Date(timestamp).toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{author.role}</span>
                    {author.badges.map(badge => (
                        <Badge key={badge} text={badge} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// src/components/Message/MessageContent.tsx
// import React from 'react';
// import { MessageContent as MessageContentType } from './types';
// import { CodeBlock } from './CodeBlock';
// import { FileAttachment } from './FileAttachment';
// import { MediaContent } from './MediaContent';

interface MessageContentProps {
    content: MessageContentType[];
    scientificTerms?: {
        term: string;
        definition: string;
        confidence: number;
    }[];
    showInsights?: boolean;
}

export const MessageContent: React.FC<MessageContentProps> = ({
    content,
    scientificTerms,
    showInsights,
}) => {
    const highlightTerm = (text: string) => {
        if (!showInsights || !scientificTerms) return text;

        let result = text;
        scientificTerms.forEach(({ term, definition }) => {
            const regex = new RegExp(`(${term})`, 'gi');
            result = result.replace(regex, `<mark title="${definition}">$1</mark>`);
        });

        return <div dangerouslySetInnerHTML={{ __html: result }} />;
    };

    return (
        <div className="space-y-4">
            {content.map((item, index) => {
                switch (item.type) {
                    case 'text':
                        return (
                            <div key={index} className="text-gray-800 dark:text-gray-200">
                                {highlightTerm(item.content)}
                            </div>
                        );

                    case 'code':
                        return (
                            <CodeBlock
                                key={index}
                                code={item.content}
                                language={item.language || 'plaintext'}
                            />
                        );

                    case 'image':
                    case 'video':
                    case 'audio':
                        return (
                            <MediaContent
                                key={index}
                                type={item.type}
                                url={item.content}
                                metadata={item.metadata}
                            />
                        );

                    case 'file':
                        return (
                            <FileAttachment
                                key={index}
                                fileName={item.fileName || ''}
                                fileSize={item.fileSize}
                                mimeType={item.mimeType}
                                url={item.content}
                            />
                        );

                    case 'link':
                        return (
                            <a
                                key={index}
                                href={item.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {item.content}
                            </a>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

// src/components/Message/AIInsightOverlay.tsx
// import React from 'react';

interface AIInsightOverlayProps {
    terms: {
        term: string;
        definition: string;
        confidence: number;
    }[];
}

export const AIInsightOverlay: React.FC<AIInsightOverlayProps> = ({ terms }) => {
    return (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Scientific Terms & Insights
            </h4>

            <div className="space-y-2">
                {terms.map(({ term, definition, confidence }, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2"
                    >
                        <div className="flex-1">
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                                {term}
                            </span>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                {definition}
                            </p>
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                            {(confidence * 100).toFixed(0)}% confidence
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// src/components/Message/MessageControls.tsx
// import React from 'react';
// import { Share, Copy, Trash, Edit, RefreshCw, Flag, MessageSquare, Star, Globe } from 'lucide-react';

interface MessageControlsProps {
    messageId: string;
    onCopy: () => void;
    onRetry: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onShare: () => void;
    onRate: (rating: number) => void;
    onReport: () => void;
    onTranslate: (targetLanguage: string) => void;
    onReply: () => void;
}

export const MessageControls: React.FC<MessageControlsProps> = ({
    onCopy,
    onRetry,
    onEdit,
    onDelete,
    onShare,
    onRate,
    onReport,
    onTranslate,
    onReply,
}) => {
    return (
        <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
                onClick={onCopy}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Copy message"
            >
                <Copy size={16} />
            </button>

            <button
                onClick={onRetry}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Retry"
            >
                <RefreshCw size={16} />
            </button>

            <button
                onClick={onEdit}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Edit"
            >
                <Edit size={16} />
            </button>

            <button
                onClick={onDelete}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Delete"
            >
                <Trash size={16} />
            </button>

            <button
                onClick={onShare}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Share"
            >
                <Share size={16} />
            </button>

            <button
                onClick={() => onRate(5)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Rate"
            >
                <Star size={16} />
            </button>

            <button
                onClick={onReport}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Report"
            >
                <Flag size={16} />
            </button>

            <button
                onClick={() => onTranslate('en')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Translate"
            >
                <Globe size={16} />
            </button>

            <button
                onClick={onReply}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Reply"
            >
                <MessageSquare size={16} />
            </button>
        </div>
    );
};

// src/components/Message/MessageFooter.tsx
// import React from 'react';
// import { MessageStatus, MessageReaction, MessageThread } from './types';

interface MessageFooterProps {
    status: MessageStatus;
    reactions: MessageReaction[];
    thread?: MessageThreadType;
    onReact: (emoji: string) => void;
}

export const MessageFooter: React.FC<MessageFooterProps> = ({
    status,
    reactions,
    thread,
    onReact,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const statusText = {
        sending: 'Sending...',
        sent: 'Sent',
        delivered: 'Delivered',
        error: 'Error sending message',
    };

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {statusText[status]}
                </span>

                <div className="flex items-center gap-2">
                    {reactions.map(({ emoji, count, users }) => (
                        <button
                            key={emoji}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            title={users.join(', ')}
                            onClick={() => onReact(emoji)}
                        >
                            <span>{emoji}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {count}
                            </span>
                        </button>
                    ))}

                    <button
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        + Add Reaction
                    </button>
                </div>
            </div>

            {thread && (
                <div className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
                    {thread.count} {thread.count === 1 ? 'reply' : 'replies'}
                </div>
            )}
        </div>
    );
};

// src/components/Message/MessageThread.tsx
// import React from 'react';
// import { MessageThread as MessageThreadType } from './types';

interface MessageThreadProps {
    thread: MessageThreadType;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ thread }) => {
    return (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 mb-2">
                Thread with {thread.count} {thread.count === 1 ? 'reply' : 'replies'}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <img
                        src={thread.lastReply.author.avatar}
                        alt={thread.lastReply.author.name}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-sm">
                        {thread.lastReply.author.name}
                    </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    {thread.lastReply.content[0].content}
                </div>
            </div>
        </div>
    );
};

// src/components/Message/CodeBlock.tsx
// import React from 'react';
// import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{language}</span>
                <button
                    onClick={copyCode}
                    className="p-1 text-gray-400 hover:text-gray-200"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            <pre className="text-sm text-gray-100 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
};

// src/components/Message/FileAttachment.tsx
// import React from 'react';
import { FileText, Download } from 'lucide-react';

interface FileAttachmentProps {
    fileName: string;
    fileSize?: number;
    mimeType?: string;
    url: string;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
    fileName,
    fileSize,
    mimeType,
    url,
}) => {
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                <FileText className="text-gray-500 dark:text-gray-400" size={24} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{fileName}</div>
                <div className="text-sm text-gray-500">
                    {mimeType} {fileSize && `• ${formatFileSize(fileSize)}`}
                </div>
            </div>

            <a
                href={url}
                download={fileName}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                <Download size={20} />
            </a>
        </div>
    );
};

// src/components/Message/MediaContent.tsx
// import React from 'react';

interface MediaContentProps {
    type: 'image' | 'video' | 'audio';
    url: string;
    metadata?: Record<string, unknown>;
}

export const MediaContent: React.FC<MediaContentProps> = ({
    type,
    url,
    metadata,
}) => {
    switch (type) {
        case 'image':
            return (
                <img
                    src={url}
                    alt={metadata?.alt as string || ''}
                    className="max-w-full rounded-lg"
                />
            );

        case 'video':
            return (
                <video
                    src={url}
                    controls
                    className="max-w-full rounded-lg"
                    poster={metadata?.thumbnail as string}
                >
                    Your browser does not support video playback.
                </video>
            );

        case 'audio':
            return (
                <audio
                    src={url}
                    controls
                    className="w-full"
                >
                    Your browser does not support audio playback.
                </audio>
            );

        default:
            return null;
    }
};

// src/components/Message/Badge.tsx
//   import React from 'react';

interface BadgeProps {
    text: string;
}

export const Badge: React.FC<BadgeProps> = ({ text }) => {
    return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {text}
        </span>
    );
};