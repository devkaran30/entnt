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
    const newSec = { 
      id: uuid(), 
      title: "New Section", 
      description: "",
      questions: [] 
    };
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
  

  const deleteOption = (secId, qId, index) => {
    const updated = data.sections.map((s) =>
      s.id === secId
        ? {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id !== qId) return q;
              const newOpts = q.options.filter((_, i) => i !== index);
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
    <div className="space-y-6 p-6">
      {/* Assessment Title */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assessment Title
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
          value={data.title}
          onChange={(e) => update({ ...data, title: e.target.value })}
          placeholder="Enter assessment title..."
        />
      </div>

      {/* Sections */}
      {(data.sections || []).map((s, sectionIndex) => (
        <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {sectionIndex + 1}
                </div>
                <div className="flex-1">
                  <input
                    className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full text-gray-900"
                    value={s.title}
                    onChange={(e) =>
                      update({
                        ...data,
                        sections: data.sections.map((sec) =>
                          sec.id === s.id ? { ...sec, title: e.target.value } : sec
                        ),
                      })
                    }
                    placeholder="Section title..."
                  />
                  <input
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1"
                    value={s.description}
                    onChange={(e) =>
                      update({
                        ...data,
                        sections: data.sections.map((sec) =>
                          sec.id === s.id ? { ...sec, description: e.target.value } : sec
                        ),
                      })
                    }
                    placeholder="Section description (optional)..."
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  update({
                    ...data,
                    sections: data.sections.filter((sec) => sec.id !== s.id),
                  })
                }
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete Section"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Questions */}
          <div className="p-6 space-y-4">
            {s.questions.map((q, questionIndex) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Q{questionIndex + 1}
                    </span>
                    <span className="text-xs text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                      {q.type}
                    </span>
                    {q.required && (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteQuestion(s.id, q.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Question"
                  >
                    🗑️
                  </button>
                </div>

                {/* Question Input */}
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium mb-3"
                  value={q.label}
                  onChange={(e) => editQuestion(s.id, q.id, "label", e.target.value)}
                  placeholder="Enter question text..."
                />

                {/* Question Type Selector */}
                <div className="flex items-center space-x-4 mb-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={q.type}
                    onChange={(e) => editQuestion(s.id, q.id, "type", e.target.value)}
                  >
                    <option value="short">Short Text</option>
                    <option value="long">Long Text</option>
                    <option value="single">Single Choice</option>
                    <option value="multi">Multiple Choice</option>
                    <option value="numeric">Numeric</option>
                    <option value="file">File Upload</option>
                  </select>

                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        editQuestion(s.id, q.id, "required", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Required</span>
                  </label>
                </div>

                {/* Choice-based Options */}
                {(q.type === "single" || q.type === "multi") && (
                  <div className="ml-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options {q.type === "single" ? "(Select one)" : "(Select multiple)"}
                    </label>
                    {(q.options || []).map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type={q.type === "single" ? "radio" : "checkbox"}
                          checked={q.correctAnswers?.includes(opt)}
                          onChange={() =>
                            toggleCorrectAnswer(s.id, q.id, opt, q.type)
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          value={opt}
                          onChange={(e) =>
                            editOption(s.id, q.id, idx, e.target.value)
                          }
                          placeholder="Option text..."
                        />
                        <button
                          onClick={() => deleteOption(s.id, q.id, idx)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Delete Option"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                      onClick={() => addOption(s.id, q.id)}
                    >
                      <span>+</span>
                      <span>Add Option</span>
                    </button>
                  </div>
                )}

                {/* Numeric Validation */}
                {q.type === "numeric" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Numeric Range Validation
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Min:</label>
                        <input
                          type="number"
                          placeholder="Minimum"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          value={q.validation?.min || ""}
                          onChange={(e) =>
                            editQuestion(s.id, q.id, "validation", {
                              ...q.validation,
                              min: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Max:</label>
                        <input
                          type="number"
                          placeholder="Maximum"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          value={q.validation?.max || ""}
                          onChange={(e) =>
                            editQuestion(s.id, q.id, "validation", {
                              ...q.validation,
                              max: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload Info */}
                {q.type === "file" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      📎 File upload functionality will be implemented in the preview mode.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add Question Button */}
            <button
              onClick={() => addQuestion(s.id)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium w-full justify-center py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
            >
              <span>+</span>
              <span>Add Question to This Section</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add Section Button */}
      <button
        onClick={addSection}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full justify-center"
      >
        <span>+</span>
        <span>Add New Section</span>
      </button>

      {/* Empty State */}
      {(!data.sections || data.sections.length === 0) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sections Yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first section to create an assessment.</p>
          <button
            onClick={addSection}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create First Section
          </button>
        </div>
      )}
    </div>
  );
}