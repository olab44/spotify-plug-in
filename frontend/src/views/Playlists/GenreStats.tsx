import styled from '@emotion/styled';
import { BoldText, InfoText, Section, SectionTitle } from './StyledComponents';

interface GenreStatsProps {
  genres: {
    topGenres: { [genre: string]: number };
    uniqueGenresCount: number;
  };
  diversityScore: number;
}

export const GenreStats = ({ genres, diversityScore }: GenreStatsProps) => {
  const sortedGenres = Object.entries(genres.topGenres).sort(([, a], [, b]) => b - a);
  const genresToDisplay = sortedGenres.slice(0, 5);

  return (
    <Section>
      <SectionTitle>Genres & Diversity</SectionTitle>
      <InfoText>
        <BoldText>Unique Genres:</BoldText> {genres.uniqueGenresCount}
      </InfoText>
      <InfoText>
        <BoldText>Diversity Score:</BoldText> {diversityScore.toFixed(2)}
      </InfoText>
      <TopGenresList>
        {genresToDisplay.map(([genre]) => (
          <li key={genre}>
            <GenreName>{genre.replace('-', ' ')}</GenreName>
          </li>
        ))}
      </TopGenresList>
    </Section>
  );
};

const TopGenresList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 16px 0;
`;

const GenreName = styled.span`
  color: #fff;
  font-weight: bold;
`;
