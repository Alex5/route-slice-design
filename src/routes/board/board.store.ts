import { create } from "zustand";

/**
 * State that is neither on the server nor in the URL: a scratch board the user
 * rearranges before anything is saved. Colocated with the route because nothing
 * outside /board has any use for it.
 *
 * The file is .ts rather than .tsx because a store renders nothing — the suffix
 * carries the role, the extension still has to tell the truth.
 */

export type Column = "todo" | "doing" | "done";

export const COLUMNS: { id: Column; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const ORDER: Column[] = ["todo", "doing", "done"];

export interface Card {
  id: string;
  title: string;
}

/**
 * Cards are grouped by column rather than held in one list, so a move replaces
 * exactly two arrays and every other column keeps its identity. That is what
 * lets a column subscribe to itself and not re-render when a card moves
 * somewhere else.
 */
type Cards = Record<Column, Card[]>;

interface BoardState {
  cards: Cards;
  move: (id: string, direction: 1 | -1) => void;
  reset: () => void;
}

const INITIAL: Cards = {
  todo: [
    { id: "c1", title: "Draft the retro" },
    { id: "c2", title: "Rename the tokens" },
  ],
  doing: [{ id: "c3", title: "Split the loader" }],
  done: [{ id: "c4", title: "Delete the dead flag" }],
};

export const useBoardStore = create<BoardState>()((set) => ({
  cards: INITIAL,
  move: (id, direction) =>
    set((state) => {
      const from = ORDER.find((column) => state.cards[column].some((card) => card.id === id));
      if (!from) return state;

      const to = ORDER[ORDER.indexOf(from) + direction];
      if (!to) return state;

      const card = state.cards[from].find((candidate) => candidate.id === id)!;

      return {
        cards: {
          ...state.cards,
          [from]: state.cards[from].filter((candidate) => candidate.id !== id),
          [to]: [...state.cards[to], card],
        },
      };
    }),
  reset: () => set({ cards: INITIAL }),
}));
