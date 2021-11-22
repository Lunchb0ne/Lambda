import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { Editor, Range } from '@tiptap/react';

interface commandProps {
  editor: Editor;
  range: Range;
  props: any;
}

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: commandProps) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(props.id)
            .run();
          // props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
