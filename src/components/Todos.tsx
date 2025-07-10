import { ChangeEvent, Ref } from "react"

type Props = {
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    ref: Ref<HTMLInputElement>
}

const Input = ({value, onChange, ref} : Props) => {
  return (
    <input value={value} onChange={onChange} ref={ref} />
  )
}
export default Input
