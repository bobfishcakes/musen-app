import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Stream } from '../constants/Interfaces';

type ActiveStreamState = {
  activeStream: Stream | undefined;
};

type ActiveStreamAction = 
  | { type: 'SET_ACTIVE_STREAM'; payload: Stream }
  | { type: 'CLEAR_ACTIVE_STREAM' };

const initialState: ActiveStreamState = {
  activeStream: undefined,
};

export const ActiveStreamContext = createContext<{
  state: ActiveStreamState;
  dispatch: React.Dispatch<ActiveStreamAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function activeStreamReducer(state: ActiveStreamState, action: ActiveStreamAction): ActiveStreamState {
  switch (action.type) {
    case 'SET_ACTIVE_STREAM':
      return {
        ...state,
        activeStream: action.payload,
      };
    case 'CLEAR_ACTIVE_STREAM':
      return {
        ...state,
        activeStream: undefined,
      };
    default:
      return state;
  }
}

export function ActiveStreamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(activeStreamReducer, initialState);

  return (
    <ActiveStreamContext.Provider value={{ state, dispatch }}>
      {children}
    </ActiveStreamContext.Provider>
  );
}