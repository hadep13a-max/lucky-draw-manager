import { useSyncExternalStore } from "react";

export type Candidate = { id: string; name: string; code?: string; note?: string };
export type Topic = { id: string; title: string; detail?: string };
export type DrawResult = {
  id: string;
  candidateId: string;
  candidateName: string;
  topicId: string;
  topicTitle: string;
  drawnAt: number;
};

type State = {
  candidates: Candidate[];
  topics: Topic[];
  results: DrawResult[];
};

const KEY = "exam-draw-state-v1";

const seed: State = {
  candidates: [
    { id: "c1", name: "Nguyễn Văn An", code: "TS001" },
    { id: "c2", name: "Trần Thị Bích", code: "TS002" },
    { id: "c3", name: "Lê Hoàng Cường", code: "TS003" },
  ],
  topics: [
    { id: "t1", title: "Đề số 1", detail: "Trình bày về chủ đề A" },
    { id: "t2", title: "Đề số 2", detail: "Trình bày về chủ đề B" },
    { id: "t3", title: "Đề số 3", detail: "Trình bày về chủ đề C" },
  ],
  results: [],
};

function load(): State {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as State;
  } catch {
    return seed;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
}

export const examStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addCandidate: (c: Omit<Candidate, "id">) =>
    setState({ candidates: [...state.candidates, { ...c, id: crypto.randomUUID() }] }),
  updateCandidate: (id: string, c: Partial<Candidate>) =>
    setState({ candidates: state.candidates.map((x) => (x.id === id ? { ...x, ...c } : x)) }),
  deleteCandidate: (id: string) =>
    setState({ candidates: state.candidates.filter((x) => x.id !== id) }),
  addTopic: (t: Omit<Topic, "id">) =>
    setState({ topics: [...state.topics, { ...t, id: crypto.randomUUID() }] }),
  updateTopic: (id: string, t: Partial<Topic>) =>
    setState({ topics: state.topics.map((x) => (x.id === id ? { ...x, ...t } : x)) }),
  deleteTopic: (id: string) => setState({ topics: state.topics.filter((x) => x.id !== id) }),
  saveResult: (candidate: Candidate, topic: Topic) =>
    setState({
      results: [
        {
          id: crypto.randomUUID(),
          candidateId: candidate.id,
          candidateName: candidate.name,
          topicId: topic.id,
          topicTitle: topic.title,
          drawnAt: Date.now(),
        },
        ...state.results,
      ],
    }),
  deleteResult: (id: string) =>
    setState({ results: state.results.filter((r) => r.id !== id) }),
  clearResults: () => setState({ results: [] }),
};

export function useExamStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    examStore.subscribe,
    () => selector(state),
    () => selector(seed),
  );
}
