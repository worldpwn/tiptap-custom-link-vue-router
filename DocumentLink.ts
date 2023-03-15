import { Link } from "@tiptap/extension-link";
import { useRouter } from "@/router";
import { mergeAttributes, getAttributes, Mark } from '@tiptap/core'
import { Plugin } from 'prosemirror-state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentLink: {
      /**
       * Set a document-link mark
       */
      setDocumentLink: (attributes: { href: string, target?: string | null }) => ReturnType,
      /**
       * Toggle a document-link mark
       */
      toggleDocumentLink: (attributes: { href: string, target?: string | null }) => ReturnType,
      /**
       * Unset a document-link mark
       */
      unsetDocumentLink: () => ReturnType,
    }
  }
}

const DocumentLink: Mark<any, any> = Link.extend({
  name: "document-link",
  renderHTML({ HTMLAttributes }) {
    const documentId = HTMLAttributes.href;
    return ['a', mergeAttributes(HTMLAttributes, { href: documentId, rel: this.options.HTMLAttributes.rel }), 0]
  },
  parseHTML() {
    return [
      { tag: 'a[href]' },
    ]
  },
  addOptions() {
    return {
      openOnClick: true,
      linkOnPaste: false,
      autolink: false,
      HTMLAttributes: {
        target: null,
        rel: null,
      },
      protocols: []
    }
  },
  addCommands() {
    return {
      setDocumentLink: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },

      toggleDocumentLink: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
      },

      unsetDocumentLink: () => ({ commands }) => {
        return commands.unsetMark(this.name, { extendEmptyMarkRange: true })
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick(view, pos, event) {
            const attrs = getAttributes(view.state, DocumentLink.name)
            const href = attrs.href;
            if (href) {
              useRouter().push({
                name: "Documents",
                query: { id: attrs.href },
              });
              return true
            }
            return true;
          },
        },
      }),
    ];
  },
})

export default DocumentLink;
