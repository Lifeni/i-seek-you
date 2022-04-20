import { TextMessage } from '../../../../index.d'

interface TextProps {
  message: TextMessage
}

export const Text = (props: TextProps) => {
  return (
    <pre w="fit" p="x-1 sm:x-0" max-w="full" font="sans" whitespace="pre-wrap">
      {props.message.content}
    </pre>
  )
}
