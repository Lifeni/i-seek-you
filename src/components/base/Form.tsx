import { children, type JSX } from 'solid-js'

export const Form = (props: JSX.FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props} text="main" flex="col start" gap="6" />
)

interface FieldProps extends JSX.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string
}

export const Field = (props: FieldProps) => {
  const elements = children(() => props.children)

  return (
    <fieldset border="none" m="0" p="0" w="full">
      <legend font="bold" text="sm light" class="uppercase" m="b-5">
        {props.legend}
      </legend>
      <div flex="start" gap="4">
        {elements}
      </div>
    </fieldset>
  )
}

interface RadioProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Radio = (props: RadioProps) => (
  <label flex="center">
    <input type="radio" w="5" h="5" m="0.25" {...props} />
    <span m="l-2" class="capitalize">
      {props.label}
    </span>
  </label>
)
