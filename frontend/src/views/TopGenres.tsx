import { PageContainer, Title } from '@/components/StyledComponents';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { useGetTopGenres } from '@/hooks/useGetTopGenres';
import React, { useState } from 'react';

const PERIODS = [
  { label: 'Last 4 weeks', value: 'short-term' },
  { label: 'Last 6 months', value: 'medium-term' },
  { label: 'Last 12 months', value: 'long-term' },
];

export const TopGenresPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('medium-term');
  const { genres, artists, loading, error } = useGetTopGenres(selectedPeriod);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const getArtistsForGenre = (genre: string) => {
    const uniqueArtists = Array.from(
      new Set(artists.filter((artist) => artist.genres.includes(genre))),
    );
    return uniqueArtists.slice(0, 4).map((artist) => ({
      id: artist.id,
      url: artist.images[0]?.url || '',
      name: artist.name,
      spotifyUrl: artist.external_urls.spotify,
    }));
  };

  return (
    <PageContainer>
      <Title>Your Top Genres</Title>
      <TimeRangeSelector
        period={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        periods={PERIODS}
      />
      <TopStatsList
        loading={loading}
        error={error}
        items={genres}
        noDataMessage="No top genres found for this period. Listen to more music!"
        renderRow={(genreItem, idx) => {
          const genreArtists = getArtistsForGenre(genreItem.genre);
          return (
            <TopStatsRow
              key={genreItem.genre}
              rank={idx + 1}
              primaryText={capitalize(genreItem.genre)}
              secondaryText={`(${genreItem.count} artists)`}
              spotifyUrl="#"
              smallImages={genreArtists}
            />
          );
        }}
      />
    </PageContainer>
  );
};
