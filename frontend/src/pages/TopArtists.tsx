import React, { useState } from "react";
import styled from "@emotion/styled";
import { useTopArtists } from "@/hooks/useGetTopArtists"; 
import LoadingIndicator from "@/components/LoadingIndicator"; 
import TimeRangeSelector from "@/components/TimeRangeSelector"; 


const PERIODS = [
  { label: "Last 4 weeks", value: "short-term" },
  { label: "Last 6 months", value: "medium-term" },
  { label: "All time", value: "long-term" },
];

const TopArtists: React.FC = () => {
  const [period, setPeriod] = useState("medium-term");

  const { artists, loading, error } = useTopArtists(period);

  return (
    <PageContainer>
      <Title>Your Top Artists</Title>
      <TimeRangeSelector period={period} onPeriodChange={setPeriod} periods={PERIODS} />

      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorMessage>Error: {error}</ErrorMessage>
      ) : (
        <ArtistsList>
          {artists.length > 0 ? (
            artists.map((artist, idx) => (
              <ArtistCard key={artist.id} onClick={() => window.open(artist.external_urls.spotify, "_blank")}>
                <ArtistIndex>{idx + 1}.</ArtistIndex>
                <ArtistImage
                  src={artist.images?.[1]?.url || artist.images?.[0]?.url || "https://placehold.co/64x64/E0E0E0/333333?text=No+Image"}
                  alt={artist.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/64x64/E0E0E0/333333?text=No+Image";
                  }}
                />
                <ArtistDetails>
                  <ArtistName>{artist.name}</ArtistName>
                  {artist.genres && artist.genres.length > 0 && (
                    <ArtistGenres>{artist.genres.slice(0, 3).join(", ")}</ArtistGenres>
                  )}
                </ArtistDetails>
              </ArtistCard>
            ))
          ) : (
            <NoDataMessage>No top artists found for the selected period.</NoDataMessage>
          )}
        </ArtistsList>
      )}
    </PageContainer>
  );
};

export default TopArtists;

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  color: #1a202c; /* Tailwind gray-900 */
`;

const Title = styled.h2`
  font-size: 2.25rem; /* Tailwind text-4xl, slightly reduced for better fit */
  font-weight: 700; /* Tailwind font-bold */
  color: #1DB954; /* Spotify Green */
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ArtistsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Reduced gap slightly */
`;

const ArtistCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem; /* Tailwind rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Stronger shadow */
  padding: 1.25rem; /* Increased padding */
  display: flex;
  align-items: center;
  gap: 1.25rem; /* Increased gap */
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e2e8f0; /* Light border */

  &:hover {
    transform: translateY(-5px); /* Slight lift effect */
    box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -4px rgba(0, 0, 0, 0.08); /* Enhanced shadow on hover */
  }
`;

const ArtistImage = styled.img`
  width: 72px; /* Slightly larger image */
  height: 72px;
  border-radius: 50%; /* Make images circular for artists */
  object-fit: cover;
  flex-shrink: 0; /* Prevent image from shrinking */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ArtistDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ArtistName = styled.div`
  font-weight: 700; /* Tailwind font-bold */
  font-size: 1.25rem; /* Tailwind text-xl */
  color: #1f2937; /* Tailwind gray-900 */
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const ArtistGenres = styled.div`
  color: #6b7280; /* Tailwind gray-500 */
  font-size: 0.95rem; /* Slightly larger text */
`;

const ArtistIndex = styled.div`
  font-weight: 800; /* Extra bold */
  font-size: 1.75rem; /* Tailwind text-2xl */
  min-width: 3rem; /* Ensure consistent width for index */
  text-align: center;
  color: #9ca3af; /* Tailwind gray-400 */
  background-color: #f9fafb; /* Light background for index */
  border-radius: 0.5rem;
  padding: 0.5rem 0.25rem;
`;

const ErrorMessage = styled.div`
  padding: 1.5rem;
  background-color: #fee2e2; /* Tailwind red-100 */
  color: #ef4444; /* Tailwind red-500 */
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  margin-top: 1.5rem;
  border: 1px solid #fca5a5; /* Tailwind red-300 */
`;

const NoDataMessage = styled.div`
  padding: 1.5rem;
  background-color: #e0f2fe; /* Tailwind blue-100 */
  color: #3b82f6; /* Tailwind blue-500 */
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  margin-top: 1.5rem;
  border: 1px solid #93c5fd; /* Tailwind blue-300 */
`;