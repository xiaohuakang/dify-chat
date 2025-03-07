import { Bubble, Prompts } from '@ant-design/x';
import { WelcomePlaceholder } from './welcome-placeholder';
import { GetProp } from 'antd';
import {
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import SenderWrapper from './sender';
import { DifyApi, IFile } from '../utils/dify-api';
import { isMobile } from '@toolkit-fe/where-am-i';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: !isMobile() ? { icon: <RobotOutlined />, style: { background: '#fde3cf' } } : undefined,
    style: isMobile() ? undefined : {
      // 减去一个头像的宽度
      maxWidth: 'calc(100% - 44px)',
    },
  },
  user: {
    placement: 'end',
    avatar: !isMobile() ? { 
      icon: <UserOutlined />, 
      style: {
        background: '#87d068',
      }
    } : undefined,
    style: isMobile()? undefined : {
      // 减去一个头像的宽度
      maxWidth: 'calc(100% - 44px)',
      marginLeft: '44px'
    },
  },
};

export interface ChatboxProps {
  items: GetProp<typeof Bubble.List, 'items'>;
  isRequesting: boolean;
  /**
   * 下一步问题建议
   */
  nextSuggestions: string[];
  onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'>;
  onSubmit: (value: string, files?: IFile[]) => void;
  difyApi: DifyApi
  onCancel: () => void
}

/**
 * 对话内容区
 */
export const Chatbox = ({
  items,
  isRequesting,
  nextSuggestions,
  onPromptsItemClick,
  onSubmit,
  difyApi,
  onCancel,
}: ChatboxProps) => {

  const [content, setContent] = useState('');

  return (
    <div className="w-full h-full overflow-hidden my-0 mx-auto box-border flex flex-col gap-4 relative bg-white">
      <div className="w-full h-full overflow-auto pt-4 pb-48">
        {/* 🌟 欢迎占位 */}
        {!items?.length && (
          <WelcomePlaceholder onPromptItemClick={onPromptsItemClick} />
        )}
        {/* 🌟 消息列表 */}
        <Bubble.List items={items} roles={roles} className="flex-1 w-full md:w-3/4 mx-auto px-3 md:px-0 box-border" />
        <div className="absolute bottom-0 bg-white w-full md:w-3/4 left-1/2" style={{
          transform: 'translateX(-50%)'
        }}>
          {/* 🌟 提示词 */}
          <Prompts
            items={nextSuggestions?.map((item, index) => {
              return {
                key: index.toString(),
                description: item,
              }
            })}
            onItemClick={onPromptsItemClick}
          />
          {/* 🌟 输入框 */}
          <div className='px-3'>
            <SenderWrapper
              content={content}
              onChange={(value) => setContent(value)}
              onSubmit={(content, files) => {
                if (!content) {
                  return;
                }
                onSubmit(content, files)
                setContent('')
              }}
              isRequesting={isRequesting}
              className="w-full"
              difyApi={difyApi}
              onCancel={onCancel}
            />
          </div>
          <div className='text-gray-400 text-sm text-center h-8 leading-8'>
            内容由 AI 生成, 仅供参考
          </div>
        </div>
      </div>
    </div>
  );
};
