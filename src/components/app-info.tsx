import { RobotOutlined } from "@ant-design/icons";
import { Tag, theme } from 'antd'

interface IAppInfoProps {
  info: {
    name: string
    description: string
    tags?: string[]
  }
}

export default function AppInfo(props: IAppInfoProps) {
  const { info } = props

  const { token } = theme.useToken()
  return (
    <div className="text-default">
      <div className="flex items-center justify-center flex-col">
        <RobotOutlined
          className='text-2xl'
          style={{
            color: token.colorPrimary,
          }}
        />
        <div className="text-2xl font-bold mt-3">{info.name}</div>
        <div className="text-desc text-base max-w-44 mt-3">
          {info.description}
        </div>
        {info.tags ? (
          <div className='mt-3'>
            {info.tags.map((tag) => {
              return <Tag key={tag}>{tag}</Tag>;
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}