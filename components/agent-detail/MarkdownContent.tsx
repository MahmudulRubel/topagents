import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Safely parses inline markdown tokens:
 * - **bold text** -> <strong className="font-bold text-gray-950">bold text</strong>
 * - `inline code` -> <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded text-indigo-700">code</code>
 */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-gray-950">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 text-indigo-600 rounded border border-gray-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * High-performance, zero-dependency Markdown block renderer.
 * Formats:
 * - ### Headings -> Styled clean <h3> titles (strips raw '###')
 * - - Bullet lists -> Clean <ul> with styled dot (strips raw '- ' and '**')
 * - 1. Numbered lists -> Semantic <ol> with native numbers
 * - Standard paragraphs -> Crisp leading-relaxed body text
 */
export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;

  const rawLines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let blockKey = 0;

  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // 1. Heading 3: "### " or Heading 2: "## "
    if (line.startsWith('### ') || line.startsWith('## ')) {
      const headingText = line.replace(/^#{2,3}\s+/, '').trim();
      elements.push(
        <h3
          key={`h3-${blockKey++}`}
          className="text-base sm:text-lg font-black text-gray-900 mt-6 mb-3 pt-3 border-t border-gray-100 first:border-t-0 first:pt-0 leading-snug tracking-tight"
        >
          {parseInline(headingText)}
        </h3>
      );
      i++;
      continue;
    }

    // 2. Unordered Bullet List Item: "- " or "* "
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
        listItems.push(rawLines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }

      elements.push(
        <ul key={`ul-${blockKey++}`} className="space-y-2.5 my-3 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6154] shrink-0 mt-2" />
              <div className="flex-1 min-w-0">{parseInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 3. Ordered Numbered List Item: "1. ", "2. ", etc.
    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }

      elements.push(
        <ol key={`ol-${blockKey++}`} className="list-decimal list-inside space-y-2 my-3 pl-1 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              <span className="font-normal">{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 4. Regular Paragraph (group consecutive non-empty lines)
    const paragraphLines: string[] = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() &&
      !rawLines[i].trim().startsWith('### ') &&
      !rawLines[i].trim().startsWith('## ') &&
      !rawLines[i].trim().startsWith('- ') &&
      !rawLines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(rawLines[i].trim())
    ) {
      paragraphLines.push(rawLines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      const combinedParagraph = paragraphLines.join(' ');
      elements.push(
        <p
          key={`p-${blockKey++}`}
          className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3.5"
        >
          {parseInline(combinedParagraph)}
        </p>
      );
    }
  }

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
