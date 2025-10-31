import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function AssessmentBuilder({ assessment, onSave }) {
  const [data, setData] = useState(
    assessment || { id: uuid(), title: "New Assessment", sections: [] }
  );

  useEffect(() => {
    if (!assessment) return;
    setData(assessment);
  }, [assessment]);

  const update = (next) => {
    setData(next);
    onSave(next);
  };

  const addSection = () => {
    const newSec = { id: uuid(), title: "New Section", questions: [] };
    update({ ...data, sections: [...(data.sections || []), newSec] });
  };

  const addQuestion = (secId) => {
    const newQ = {
      id: uuid(),
      label: "New Question",
      type: "short",
      required: false,
      options: [],
      correctAnswers: [],
      validation: {},
    };
    const updated = data.sections.map((s) =>
      s.id === secId ? { ...s, questions: [...s.questions, newQ] } : s
    );
    update({ ...data, sections: updated });
  };

  const editQuestion = (secId, qId, field, value) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? {
            ...s,
            questions: s.questions.map((q) =>
              q.id === qId ? { ...q, [field]: value } : q
            ),
          }
        : s
    );
    update({ ...data, sections: updated });
  };

  const deleteQuestion = (secId, qId) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? { ...s, questions: s.questions.filter((q) => q.id !== qId) }
        : s
    );
    update({ ...data, sections: updated });
  };

  const addOption = (secId, qId) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? {
            ...s,
            questions: s.questions.map((q) =>
              q.id === qId
                ? { ...q, options: [...(q.options || []), "New Option"] }
                : q
            ),
          }
        : s
    );
    update({ ...data, sections: updated });
  };

  const editOption = (secId, qId, index, value) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id !== qId) return q;
              const newOpts = [...q.options];
              newOpts[index] = value;
              return { ...q, options: newOpts };
            }),
          }
        : s
    );
    update({ ...data, sections: updated });
  };

  const toggleCorrectAnswer = (secId, qId, opt, type) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id !== qId) return q;
              let correct = [...(q.correctAnswers || [])];
              if (type === "single") {
                correct = [opt];
              } else {
                if (correct.includes(opt))
                  correct = correct.filter((c) => c !== opt);
                else correct.push(opt);
              }
              return { ...q, correctAnswers: correct };
            }),
          }
        : s
    );
    update({ ...data, sections: updated });
  };

  return (
    <div className="space-y-6">
      {(data.sections || []).map((s) => (
        <div key={s.id} className="border p-3 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <input
              className="font-semibold text-lg border-b focus:outline-none w-full"
              value={s.title}
              onChange={(e) =>
                update({
                  ...data,
                  sections: data.sections.map((sec) =>
                    sec.id === s.id ? { ...sec, title: e.target.value } : sec
                  ),
                })
              }
            />
            <button
              onClick={() =>
                update({
                  ...data,
                  sections: data.sections.filter((sec) => sec.id !== s.id),
                })
              }
              className="text-red-600 hover:underline"
            >
              Delete Section
            </button>
          </div>

          {s.questions.map((q) => (
            <div
              key={q.id}
              className="p-3 mb-3 border rounded bg-white space-y-2"
            >
              <input
                className="w-full border-b focus:outline-none font-medium"
                value={q.label}
                onChange={(e) => editQuestion(s.id, q.id, "label", e.target.value)}
                placeholder="Enter question text..."
              />

              <select
                className="border p-1 rounded"
                value={q.type}
                onChange={(e) => editQuestion(s.id, q.id, "type", e.target.value)}
              >
                <option value="single">Single Choice</option>
                <option value="multi">Multiple Choice</option>
                <option value="short">Short Text</option>
                <option value="long">Long Text</option>
                <option value="numeric">Numeric (Range)</option>
                <option value="file">File Upload (Stub)</option>
              </select>

              {/* ---- Choice-based ---- */}
              {(q.type === "single" || q.type === "multi") && (
                <div className="ml-3">
                  {(q.options || []).map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        className="border p-1 rounded flex-1"
                        value={opt}
                        onChange={(e) =>
                          editOption(s.id, q.id, idx, e.target.value)
                        }
                      />
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        checked={q.correctAnswers?.includes(opt)}
                        onChange={() =>
                          toggleCorrectAnswer(s.id, q.id, opt, q.type)
                        }
                      />
                      <span className="text-xs text-gray-500">Correct</span>
                    </div>
                  ))}
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => addOption(s.id, q.id)}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* ---- Numeric Validation ---- */}
              {q.type === "numeric" && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border p-1 rounded w-20"
                    value={q.validation?.min || ""}
                    onChange={(e) =>
                      editQuestion(s.id, q.id, "validation", {
                        ...q.validation,
                        min: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="border p-1 rounded w-20"
                    value={q.validation?.max || ""}
                    onChange={(e) =>
                      editQuestion(s.id, q.id, "validation", {
                        ...q.validation,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              {/* ---- Required ---- */}
              <label className="flex items-center gap-2 text-sm mt-1">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    editQuestion(s.id, q.id, "required", e.target.checked)
                  }
                />
                Required
              </label>

              <button
                onClick={() => deleteQuestion(s.id, q.id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete Question
              </button>
            </div>
          ))}

          <button
            onClick={() => addQuestion(s.id)}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add Question
          </button>
        </div>
      ))}

      <button
        onClick={addSection}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        + Add Section
      </button>
    </div>
  );
}
