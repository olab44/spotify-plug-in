import styled from '@emotion/styled';
import { BoldText, InfoText, Section, SectionTitle } from '../StyledComponents';

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
        {genresToDisplay.map(([genre, count], index) => (
          <LeaderboardItem key={genre}>
            <Rank>{index + 1}.</Rank>
            <GenreName>{genre.replace('-', ' ')}</GenreName>
          </LeaderboardItem>
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

const LeaderboardItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  color: #1ed760; // Spotify green for a vibrant touch
  margin-right: 12px;
`;

const GenreName = styled.span`
  flex-grow: 1;
  color: #fff;
  font-weight: bold;
`;

const TrackCount = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
`;
