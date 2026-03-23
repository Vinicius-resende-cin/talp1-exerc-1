export interface Alternative {
  id?: string;
  description: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  description: string;
  alternatives: Alternative[];
}

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const res = await fetch('/api/questions');
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Failed to fetch', err);
    return [];
  }
};

export const createQuestion = async (q: Omit<Question, 'id'>): Promise<Question> => {
  const res = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
};

export const updateQuestion = async (id: string, q: Omit<Question, 'id'>): Promise<Question> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
};

export const deleteQuestion = async (id: string): Promise<void> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
};
