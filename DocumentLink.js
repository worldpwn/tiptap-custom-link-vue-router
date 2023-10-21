import { Link } from "@tiptap/extension-link";
import router from "@/router";
import { mergeAttributes, getAttributes } from '@tiptap/core'
import { Plugin } from 'prosemirror-state';

const DocumentLink = Link.extend({
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
            const clickedNode = view.state.doc.nodeAt(pos);
            const documentLinkMark = clickedNode?.marks.find(m => m.type.name === DocumentLink.name);
            if (documentLinkMark) {
              router().push({
                name: "Documents",
                query: { id: documentLinkMark.attrs.href },
              });
            }
            const linkMark = clickedNode?.marks.find(m => m.type.name === Link.name);
            if (linkMark) {
              window.open(linkMark.attrs.href);
            }
            return true;
          },
        },
      }),
    ];
  },

})


export default DocumentLink;

