import { Fragment } from 'react';
import { splitByMatches } from '@/utils/search';
import styles from './HighlightedText.module.scss';

interface HighlightedTextProps {
  text: string;
  query: string;
}

const HighlightedText = ({ text, query }: HighlightedTextProps) => (
  <>
    {splitByMatches(text, query).map((segment, index) =>
      segment.isMatch ? (
        <mark className={styles.match} key={index}>
          {segment.text}
        </mark>
      ) : (
        <Fragment key={index}>{segment.text}</Fragment>
      ),
    )}
  </>
);

export default HighlightedText;
