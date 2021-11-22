import { ReactRenderer, Editor } from '@tiptap/react';
import tippy from 'tippy.js';
import autoSuggestionList from './autosuggestionList';
import { fetcher, postData } from '../../lib/utils';

interface itemType {
  editor: Editor;
  query: string;
}
const suggestion = {
  items: async ({ editor, query }: itemType) => {
    const text = editor.getText().slice(0, -1);
    const req = await postData('http://localhost:3000/api/hello', {
      data: text,
    });
    const final_data = await req.data;
    return final_data;
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(autoSuggestionList, {
          props,
          editor: props.editor,
        });

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default suggestion;
