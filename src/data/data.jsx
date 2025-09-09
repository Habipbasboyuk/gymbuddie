export async function fetchWorkouts(apiUrl, apiToken) {
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch workouts');
  }
  const data = await res.json();
  return data.data;
}


export async function postWorkout(apiUrl, apiToken, workout) {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ data: workout }),
  });
    if (!res.ok) {
    throw new Error('Failed to post workout');
    }
    const data = await res.json();
    return data.data;
}
