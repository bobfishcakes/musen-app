import { useContext } from 'react';
import { ActiveStreamContext } from '@/contexts/ActiveStreamContext';
import type { Stream } from '../constants/Interfaces';
import { mockNbaGames } from '@/app/mockData';

const DEFAULT_STREAM: Stream = {
  id: 'bobfishcakes-default',
  title: "Mavs Moneyline",
  streamer: 'bobfishcakes',
  game: mockNbaGames[0],
  listeners: 1
};

export function useActiveStream(): {
  activeStream: Stream;
  setActiveStream: (stream: Stream) => void;
  clearActiveStream: () => void;
} {
  const { state, dispatch } = useContext(ActiveStreamContext);

  const setActiveStream = (stream: Stream) => {
    dispatch({ type: 'SET_ACTIVE_STREAM', payload: stream });
  };

  const clearActiveStream = () => {
    dispatch({ type: 'CLEAR_ACTIVE_STREAM' });
  };

  return {
    activeStream: state.activeStream || DEFAULT_STREAM,
    setActiveStream,
    clearActiveStream,
  };
}
