import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const PERIODS = [
  { label: "Last 4 weeks", value: "short-term" },
  { label: "Last 6 months", value: "medium-term" },
  { label: "All time", value: "long-term" },
];

const TopTracks: React.FC = () => {
  const [period, setPeriod] = useState("medium-term");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTracks = async (selectedPeriod: string) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/top-tracks/${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTracks(response.data);
    } catch (err) {
      console.error("Failed to fetch tracks:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/");
      }
      setTracks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTracks(period);
  }, [period, navigate]);

  return (
    <PageContainer>
      <Title>Your Top 50 Tracks</Title>
      <PeriodButtonsContainer>
        {PERIODS.map((p) => (
          <PeriodButton key={p.value} isActive={period === p.value} onClick={() => setPeriod(p.value)}>
            {p.label}
          </PeriodButton>
        ))}
      </PeriodButtonsContainer>
      {loading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <TracksList>
          {tracks.map((track, idx) => (
            <TrackCard key={track.id}>
              <TrackIndex>{idx + 1}.</TrackIndex>
              <TrackImage src={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url} alt={track.name} />
              <TrackDetails>
                <TrackName>{track.name}</TrackName>
                <TrackArtists>{track.artists.map((a: any) => a.name).join(", ")}</TrackArtists>
                <TrackAlbum>{track.album.name}</TrackAlbum>
              </TrackDetails>
            </TrackCard>
          ))}
        </TracksList>
      )}
    </PageContainer>
  );
};

export default TopTracks;

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const PeriodButtonsContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const PeriodButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: ${(props) => (props.isActive ? "#16a34a" : "#e5e7eb")};
  color: ${(props) => (props.isActive ? "white" : "#4b5563")};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#15803d" : "#d1d5db")};
  }
`;

const LoadingText = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TrackCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TrackImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 0.25rem;
`;

const TrackDetails = styled.div`
  flex-grow: 1;
`;

const TrackName = styled.div`
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

const TrackArtists = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const TrackAlbum = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const TrackIndex = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
  min-width: 2rem;
  text-align: right;
  color: #4b5563;
`;