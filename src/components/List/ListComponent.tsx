import { ReactNode } from 'react'
import { Placeholder } from 'src/components/placeholders'
import { CarbonAd } from 'src/features/carbonAds'
import { BaseEntry } from 'src/types'

export type ListComponentPropsType<T extends BaseEntry> = {
  items: T[]
  isLoading: boolean
  renderItem: (item: T, index: number) => React.ReactNode
  withAds: boolean
  placeholder?: React.ReactNode
  refresh?: boolean
  error?: any
}

export function ListComponent<T extends BaseEntry>(props: ListComponentPropsType<T>) {
  const { items, isLoading, error, renderItem, withAds, placeholder = <Placeholder /> } = props

  if (error) {
    return <p className="errorMsg">{error?.message || error}</p>
  }

  const renderItems = () => {
    if (!items) {
      return
    }

    return items.map((item, index) => {
      let content: ReactNode[] = [renderItem(item, index)]
      if (withAds && index === 0) {
        content.unshift(<CarbonAd key={'carbonAd0'} />)
      }
      return content
    })
  }

  function Placeholders() {
    return (
      <>
        {[...Array(7)].map((x, i) => (
          <span key={i}>{placeholder}</span>
        ))}
      </>
    )
  }

  return <>{isLoading ? <Placeholders /> : renderItems()}</>
}
