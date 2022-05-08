import { createI18nContext, I18nContext } from '@solid-primitives/i18n'
import { type JSX } from 'solid-js'
import { dict } from './dictionary'

export const I18nProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const lang = navigator.language
  const keys = Object.keys(dict)
  const value = createI18nContext(dict, keys.includes(lang) ? lang : 'en')

  return (
    <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
  )
}
