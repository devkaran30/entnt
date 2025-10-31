import React, { useState } from "react";

export default function AssessmentPreview({ assessment, onSubmit }) {
  const [responses, setResponses] = useState({});

  const handleChange = (qid, val) => {
    setResponses({ ...responses, [qid]: val });
  };

  const validate = () => {
    for (const sec of assessment.sections) {
      for (const q of sec.questions) {
        if (q.required && !responses[q.id]) {
          alert(`Question "${q.label}" is required`);
          return false;
        }
        if (q.type === "numeric" && q.validation) {
          const val = Number(responses[q.id]);
          if (val < q.validation.min || val > q.validation.max) {
            alert(
              `Question "${q.label}" must be between ${q.validation.min} and ${q.validation.max}`
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  const submit = () => {
    if (!validate()) return;
    const payload = Object.entries(responses).map(([qid, answer]) => ({
      questionId: qid,
      answer,
    }));
    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      {assessment.sections.map((s) => (
        <div key={s.id} className="border p-3 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
          {s.questions.map((q) => (
            <div key={q.id} className="mb-3">
              <label className="block mb-1 font-medium">{q.label}</label>
              {q.type === "short" && (
                <input
                  className="border p-1 w-full rounded"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "long" && (
                <textarea
                  className="border p-1 w-full rounded"
                  rows="3"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "single" &&
                q.options?.map((opt) => (
                  <label key={opt} className="block text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />{" "}
                    {opt}
                  </label>
                ))}
              {q.type === "multi" &&
                q.options?.map((opt) => (
                  <label key={opt} className="block text-sm">
                    <input
                      type="checkbox"
                      value={opt}
                      onChange={(e) =>
                        handleChange(
                          q.id,
                          responses[q.id]
                            ? [...responses[q.id], e.target.value]
                            : [e.target.value]
                        )
                      }
                    />{" "}
                    {opt}
                  </label>
                ))}
              {q.type === "numeric" && (
                <input
                  type="number"
                  className="border p-1 w-32 rounded"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "file" && (
                <input
                  type="file"
                  disabled
                  className="text-gray-500 text-sm"
                  title="File upload not implemented yet"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Responses
      </button>
    </div>
  );
}


