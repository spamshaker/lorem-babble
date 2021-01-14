import {createContext, Dispatch, SetStateAction} from 'react';

export const SearchContext = createContext<{
  text?: string;
  updateSearch: Dispatch<SetStateAction<string | undefined>>;
}>({updateSearch: () => true});
