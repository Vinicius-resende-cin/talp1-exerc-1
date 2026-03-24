/**
 * Represents a single choice alternative for a question.
 */
export interface Alternative {
  id?: string;
  description: string;
  isCorrect: boolean;
}

/**
 * Represents a test or quiz question containing multiple alternatives.
 */
export interface Question {
  id: string;
  description: string;
  alternatives: Alternative[];
}

/**
 * Fetches all questions from the API.
 *
 * @returns {Promise<Question[]>} A promise that resolves to an array of questions.
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const res = await fetch("/api/questions");
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Failed to fetch", err);
    return [];
  }
};

/**
 * Creates a new question via the API.
 *
 * @param {Omit<Question, "id">} q - The question data to create, omitting the ID.
 * @returns {Promise<Question>} A promise that resolves to the created question.
 */
export const createQuestion = async (
  q: Omit<Question, "id">,
): Promise<Question> => {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

/**
 * Updates an existing question via the API.
 *
 * @param {string} id - The ID of the question to update.
 * @param {Omit<Question, "id">} q - The updated question data.
 * @returns {Promise<Question>} A promise that resolves to the updated question.
 */
export const updateQuestion = async (
  id: string,
  q: Omit<Question, "id">,
): Promise<Question> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

/**
 * Deletes a question via the API.
 *
 * @param {string} id - The ID of the question to delete.
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  const res = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};
