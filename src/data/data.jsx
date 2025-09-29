export async function fetchWorkouts(apiUrl, apiToken) {
  const res = await fetch(`${apiUrl}?populate=*`, {
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
  const res = await fetch(`${apiUrl}?populate=*`, {
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

export async function deleteWorkout(apiUrl, apiToken, id) {
  const url = `${apiUrl}/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete workout: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return true;
}


export async function fetchWorkoutsWithSets(apiUrl, apiToken) {
  const res = await fetch(`${apiUrl}?populate[exercises][populate]=sets`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch workouts with sets');
  }
  const data = await res.json();
  return data.data;
}


export async function fetchExercises(apiUrl, apiToken) {
  const res = await fetch(`${apiUrl}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch workouts with sets');
  }
  const data = await res.json();
  return data.data;
}

export async function updateSet(apiUrl, apiToken, setId, data) {
  const res = await fetch(`${apiUrl}/${setId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('Failed to update set');
  return await res.json();
}
