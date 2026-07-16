export type LetterBox = 'drafts' | 'sent' | 'inbox';

export async function getLetters(box: LetterBox) {
  const res = await fetch(`/letters?box=${box}`);
  return res.json()
}

export async function getLetter(id: string) {
  const res = await fetch(`/letters/${id}`);
  return res.json()
}

export async function createDraft(data: any) {
  const res = await fetch('/letters/draft', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json()
}

export async function updateDraft(id: string, data: any) {
  const res = await fetch(`/letters/draft/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json()
}

export async function sendDraft(id: string) {
  const res = await fetch(`/letters/send/${id}`, {
    method: 'POST',
  });
  return res.json()
}

export async function deleteDraft(id: string) {
  const res = await fetch(`/letters/${id}`, {
    method: 'DELETE',
  });
  return res.json()
}