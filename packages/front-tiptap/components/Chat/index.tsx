import { Children, ReactChildren } from 'react';
import { MessageList } from '~/lib/message';
import { useMessage } from '../../lib/message/useMessage';
interface Props {
  children?: ReactChildren;
}
const Chat = ({ children }: Props) => {
  const { messages } = useMessage();
  return <MessageList messages={messages}>{children}</MessageList>;
  // return <div className="m-auto">Chat was here, just chillin</div>;
};
export default Chat;
