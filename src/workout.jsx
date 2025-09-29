import Footer from "./components/footer.jsx";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { updateSet } from "./data/data.jsx";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_URL_WORKOUTS = import.meta.env.VITE_API_URL_WORKOUTS;
const VITE_API_URL_SETS = import.meta.env.VITE_API_URL_SETS;

function Workout({ workouts, refreshWorkouts }) {
  const [inputs, setInputs] = useState({});
  const { documentId } = useParams();
  const workout = workouts.find((w) => String(w.documentId) === documentId);

  if (!workout) return <div>Workout not found</div>;

  const handleAddSet = async (exercise) => {
    // Bepaal het volgende setNumber
    const existingSetNumbers = exercise.sets?.map((s) => s.setNumber) || [];
    let setNumber = 1;
    while (existingSetNumbers.includes(setNumber)) {
      setNumber++;
    }

    // Bouw de body voor je request
    const body = {
      data: {
        setNumber,
        previous: "-",
        kg: 1,
        rep: 1,
        done: false,
        exercise: exercise.id, // gebruik het numerieke id voor POST!
      },
    };

    try {
      await fetch(VITE_API_URL_SETS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      if (refreshWorkouts) refreshWorkouts();
    } catch (err) {
      console.error("Fout bij toevoegen set:", err);
    }
  };

  const handleInputChange = async (exerciseId, setIdx, field, value, setId) => {
    const newInputs = {
      ...inputs,
      [exerciseId]: {
        ...inputs[exerciseId],
        [setIdx]: {
          ...((inputs[exerciseId] && inputs[exerciseId][setIdx]) || {}),
          [field]: value,
        },
      },
    };

    setInputs(newInputs);

    if (field === "done" && setId) {
      // Controleer of setId geldig is
      if (!setId || setId === 'undefined') {
        console.error('Invalid setId:', setId);
        return;
      }

      const kg = newInputs[exerciseId]?.[setIdx]?.kg;
      const rep = newInputs[exerciseId]?.[setIdx]?.rep;
      const previous = kg && rep ? `${kg}kg x ${rep}` : "";

      try {
        const response = await updateSet(
          VITE_API_URL_SETS,
          API_TOKEN,
          setId, // gebruik documentId voor PUT!
          {
            kg,
            rep,
            done: value,
            previous,
          }
        );
        if (refreshWorkouts) refreshWorkouts();
      } catch (err) {
        console.error("Update error:", err);
        // Refresh data als update faalt
        if (refreshWorkouts) refreshWorkouts();
      }
    }
  };

  return (
    <>
      <div className="workout">
        <h1 className="workout__title">{workout.title}</h1>
        <p className="workout__info">{workout.exercises?.length || 0} exercises</p>
        {workout.exercises.map((exercise) => (
          <article key={exercise.documentId} className="workout__exercise">
            <p className="workout__exercise-name">{exercise.name}</p>
            <table className="workout__exercise-table">
              <thead className="workout__table-head">
                <tr className="workout__table-row">
                  <th className="workout__table-header">Set</th>
                  <th className="workout__table-header">Previous</th>
                  <th className="workout__table-header">Kg</th>
                  <th className="workout__table-header">Reps</th>
                  <th className="workout__table-header">Done</th>
                </tr>
              </thead>
              <tbody className="workout__table-body">
                {exercise.sets && exercise.sets.length > 0 && (
                  exercise.sets.map((set, idx) => (
                    <tr key={set.documentId} className="workout__table-row">
                      <td className="workout__table-cell">{set.setNumber}</td>
                      <td className="workout__table-cell">
                        {inputs[exercise.documentId]?.[idx]?.done
                          ? `${inputs[exercise.documentId][idx].kg || ""}kg x ${
                              inputs[exercise.documentId][idx].rep || ""
                            }`
                          : set.previous}
                      </td>
                      <td className="workout__table-cell">
                        <input
                          type="number"
                          className="workout__input workout__input--kg"
                          value={
                            inputs[exercise.documentId]?.[idx]?.kg ??
                            set.kg ??
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              exercise.documentId,
                              idx,
                              "kg",
                              e.target.value,
                              set.documentId // <-- Gebruik documentId voor updates!
                            )
                          }
                          placeholder="kg"
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td className="workout__table-cell">
                        <input
                          type="number"
                          className="workout__input workout__input--rep"
                          value={
                            inputs[exercise.documentId]?.[idx]?.rep ??
                            set.rep ??
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              exercise.documentId,
                              idx,
                              "rep",
                              e.target.value,
                              set.documentId // <-- Gebruik documentId voor updates!
                            )
                          }
                          placeholder="reps"
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td className="workout__table-cell">
                        <input
                          type="checkbox"
                          className="workout__checkbox"
                          checked={
                            inputs[exercise.documentId]?.[idx]?.done ??
                            set.done ??
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              exercise.documentId,
                              idx,
                              "done",
                              e.target.checked,
                              set.documentId // <-- Gebruik documentId voor updates!
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button
              className="workout__add-set-btn btn"
              onClick={() => handleAddSet(exercise)}
            >
              Add Set
            </button>
          </article>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default Workout;