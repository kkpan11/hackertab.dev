import { Card } from 'src/components/Elements'
import { ListComponent } from 'src/components/List'
import { useGetRedditArticles } from '../../api/getRedditArticles'
import { Article, CardPropsType } from 'src/types'
import { useUserPreferences } from 'src/stores/preferences'
import { getCardTagsValue } from 'src/utils/DataEnhancement'
import ArticleItem from './ArticleItem'
import { useState, useEffect } from 'react'
import { Tag } from 'src/features/remoteConfig'
import { GLOBAL_TAG, MY_LANGUAGES_TAG } from 'src/config'
import SelectableCard from 'src/components/SelectableCard'
import { trackCardLanguageSelect } from 'src/lib/analytics'

const REDDIT_MENU_LANGUAGE_ID = 'REDDIT_MENU_LANGUAGE_ID'

export function RedditCard({ withAds, meta }: CardPropsType) {
  const { userSelectedTags, cardsSettings, setCardSettings } = useUserPreferences()
  const [selectedTag, setSelectedTag] = useState<Tag>()

  useEffect(() => {
    if (selectedTag) {
      setCardSettings(meta.value, { language: selectedTag.label })
    }
  }, [selectedTag, meta, setCardSettings])

  const getQueryTags = () => {
    if (!selectedTag) {
      return []
    }

    if (selectedTag.value === MY_LANGUAGES_TAG.redditValues[0]) {
      return getCardTagsValue(userSelectedTags, 'redditValues') || []
    }
    return selectedTag.redditValues || []
  }

  console.log('getQueryTags()', getQueryTags())
  const results = useGetRedditArticles({ tags: getQueryTags() })

  const getIsLoading = () => results.some((result) => result.isLoading)

  const getData = () => {
    return results
      .reduce((acc: Article[], curr) => {
        if (!curr.data) return acc
        return [...acc, ...curr.data]
      }, [])
      .sort((a, b) => b.reactions - a.reactions)
  }

  const renderItem = (item: Article, index: number) => (
    <ArticleItem
      item={item}
      key={`md-${index}`}
      index={index}
      selectedTag={selectedTag}
      analyticsTag={meta.analyticsTag}
    />
  )

  const HeaderTitle = () => {
    return (
      <div style={{ display: 'inline-block', margin: 0, padding: 0 }}>
        <span> {meta.label} </span>
        <SelectableCard
          isLanguage={true}
          tagId={REDDIT_MENU_LANGUAGE_ID}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          fallbackTag={GLOBAL_TAG}
          cardSettings={cardsSettings?.reddit?.language}
          trackEvent={(tag: Tag) => trackCardLanguageSelect(meta.analyticsTag, tag.value)}
          data={userSelectedTags.map((tag) => ({
            label: tag.label,
            value: tag.value,
          }))}
        />
      </div>
    )
  }

  return (
    <Card card={meta} titleComponent={<HeaderTitle />}>
      <ListComponent
        items={getData()}
        isLoading={getIsLoading()}
        renderItem={renderItem}
        withAds={withAds}
      />
    </Card>
  )
}