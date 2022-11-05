import { BiCommentDetail } from 'react-icons/bi'
import CardLink from 'src/components/CardLink'
import CardItemWithActions from 'src/components/CardItemWithActions'
import { ArticleItemPropsType } from 'src/types'
import { format } from 'timeago.js'
import { MdAccessTime } from 'react-icons/md'
import { ColoredLanguagesBadge } from 'src/components/Elements'

import { AiTwotoneHeart } from 'react-icons/ai'
import { Attributes } from 'src/lib/analytics'

const ArticleItem = (props: ArticleItemPropsType) => {
  const { item, index, listingMode, selectedTag } = props

  return (
    <CardItemWithActions
      source={'hashnode'}
      index={index}
      key={index}
      item={item}
      cardItem={
        <>
          <CardLink
            link={item.url}
            analyticsAttributes={{
              [Attributes.POINTS]: item.reactions,
              [Attributes.TRIGERED_FROM]: 'card',
              [Attributes.TITLE]: item.title,
              [Attributes.LINK]: item.url,
              [Attributes.SOURCE]: 'hashnode',
              [Attributes.LANGUAGE]: selectedTag?.value,
            }}>
            {listingMode === 'compact' && (
              <div className="counterWrapper">
                <AiTwotoneHeart />
                <span className="value">{item.reactions || 0}</span>
              </div>
            )}
            <div className="subTitle">{item.title}</div>
          </CardLink>

          {listingMode === 'normal' && (
            <>
              <p className="rowDescription">
                <span className="rowItem">
                  <MdAccessTime className={'rowTitleIcon'} />
                  {format(new Date(item.published_at))}
                </span>
                <span className="rowItem">
                  <BiCommentDetail className={'rowTitleIcon'} />
                  {item.comments || 0} comments
                </span>
                <span className="rowItem">
                  <AiTwotoneHeart className={'rowTitleIcon'} />
                  {item.reactions || 0} reactions
                </span>
              </p>
              <p className="rowDetails">
                <ColoredLanguagesBadge languages={item.tags.slice(0, 3)} />
              </p>
            </>
          )}
        </>
      }
    />
  )
}

export default ArticleItem
