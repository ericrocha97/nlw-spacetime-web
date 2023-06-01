interface ButtonProps {
  title: string
}

export function Button(props: ButtonProps) {
  return <button style={{ color: '#F00' }}>{props.title}</button>
}
