import React, { useState } from "react";

export default function AssessmentPreview({ assessment, onSubmit }) {
  const [responses, setResponses] = useState({});

  // Helper function to generate accept attribute based on file type
  const getAcceptAttribute = (fileType) => {
    switch (fileType) {
      case 'image':
        return 'image/*';
      case 'document':
        return '.doc,.docx,.txt,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'pdf':
        return '.pdf,application/pdf';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  const handleChange = (qid, val) => {
    setResponses({ ...responses, [qid]: val });
  };

  const handleMultiChange = (qid, opt, isChecked) => {
    const current = responses[qid] || [];
    let updated;
    if (isChecked) {
      updated = [...current, opt];
    } else {
      updated = current.filter(item => item !== opt);
    }
    setResponses({ ...responses, [qid]: updated });
  };

  const validate = () => {
    for (const sec of assessment.sections || []) {
      for (const q of sec.questions || []) {
        if (q.required && !responses[q.id]) {
          alert(`Question "${q.label}" is required`);
          return false;
        }
        if (q.type === "numeric" && q.validation && responses[q.id]) {
          const val = Number(responses[q.id]);
          if (val < q.validation.min || val > q.validation.max) {
            alert(
              `Question "${q.label}" must be between ${q.validation.min} and ${q.validation.max}`
            );
            return false;
          }
        }
        
        // File upload validation
        if (q.type === "file" && q.required && (!responses[q.id] || !responses[q.id].files || responses[q.id].files.length === 0)) {
          alert(`File upload required for "${q.label}"`);
          return false;
        }
      }
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    
    // Process file uploads
    const processedResponses = await Promise.all(
      Object.entries(responses).map(async ([qid, answer]) => {
        const question = assessment.sections
          .flatMap(s => s.questions || [])
          .find(q => q.id === qid);
        
        if (question?.type === 'file' && answer.files) {
          // For file uploads, we'll create a simplified response
          // In a real app, you would upload files to a server here
          return {
            questionId: qid,
            answer: {
              fileCount: answer.files.length,
              fileNames: answer.files.map(f => f.name),
              totalSize: answer.files.reduce((sum, f) => sum + f.size, 0),
              // In a real implementation, you would upload files and get URLs
              uploaded: false, // Placeholder for actual upload status
              timestamp: answer.timestamp
            }
          };
        }
        
        return {
          questionId: qid,
          answer: answer
        };
      })
    );
    
    onSubmit(processedResponses);
  };

  if (!assessment?.sections?.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👁️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessment to Preview</h3>
          <p className="text-gray-600">Add some sections and questions in the builder first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Assessment Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
        <p className="text-gray-600">Please complete all required questions below</p>
      </div>

      {/* Sections */}
      {assessment.sections.map((s, sectionIndex) => (
        <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {sectionIndex + 1}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{s.title}</h3>
                {s.description && (
                  <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="p-6 space-y-6">
            {(s.questions || []).map((q, questionIndex) => (
              <div key={q.id} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">
                    Q{questionIndex + 1}
                  </span>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {q.label}
                      {q.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Short Text */}
                    {q.type === "short" && (
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        placeholder="Enter your answer..."
                      />
                    )}

                    {/* Long Text */}
                    {q.type === "long" && (
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
                        rows="4"
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        placeholder="Enter your detailed answer..."
                      />
                    )}

                    {/* Single Choice */}
                    {q.type === "single" && (
                      <div className="space-y-2">
                        {(q.options || []).map((opt) => (
                          <label key={opt} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              onChange={(e) => handleChange(q.id, e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Multiple Choice */}
                    {q.type === "multi" && (
                      <div className="space-y-2">
                        {(q.options || []).map((opt) => (
                          <label key={opt} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              value={opt}
                              onChange={(e) => handleMultiChange(q.id, opt, e.target.checked)}
                              className="text-green-600 focus:ring-green-500 rounded"
                            />
                            <span className="text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Numeric */}
                    {q.type === "numeric" && (
                      <div className="space-y-2">
                        <input
                          type="number"
                          className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          placeholder="Enter number..."
                        />
                        {q.validation && (
                          <p className="text-xs text-gray-500">
                            Must be between {q.validation.min} and {q.validation.max}
                          </p>
                        )}
                      </div>
                    )}

                    {/* File Upload */}
                    {q.type === "file" && (
                      <div className="space-y-3">
                        <div className={`border-2 border-dashed ${
                          responses[q.id]?.files?.length ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        } rounded-lg p-6 transition-colors`}>
                          <input
                            type="file"
                            id={`file-${q.id}`}
                            multiple={q.validation?.multiple || false}
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              
                              // Validate file types
                              const allowedTypes = {
                                'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                                'document': ['.doc', '.docx', '.txt', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                                'pdf': ['application/pdf'],
                                'video': ['video/mp4', 'video/mpeg', 'video/quicktime'],
                                'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg']
                              };
                              
                              const maxSize = (q.validation?.maxSize || 10) * 1024 * 1024; // Convert to bytes
                              const selectedType = q.validation?.fileTypes || 'all';
                              
                              let validFiles = true;
                              let errorMessage = '';
                              
                              for (const file of files) {
                                // Check file size
                                if (file.size > maxSize) {
                                  validFiles = false;
                                  errorMessage = `File "${file.name}" exceeds maximum size of ${q.validation?.maxSize || 10}MB`;
                                  break;
                                }
                                
                                // Check file type if specific type is selected
                                if (selectedType !== 'all' && allowedTypes[selectedType]) {
                                  const isTypeValid = allowedTypes[selectedType].some(type => 
                                    file.type.includes(type.replace('.', '')) || file.name.toLowerCase().endsWith(type)
                                  );
                                  
                                  if (!isTypeValid) {
                                    validFiles = false;
                                    errorMessage = `File "${file.name}" is not a valid ${selectedType} file`;
                                    break;
                                  }
                                }
                              }
                              
                              if (!validFiles) {
                                alert(errorMessage);
                                e.target.value = ''; // Clear the input
                                return;
                              }
                              
                              // Create file preview data
                              const fileData = files.map(file => ({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                lastModified: file.lastModified,
                                file: file // Store the actual file object
                              }));
                              
                              handleChange(q.id, {
                                files: fileData,
                                timestamp: new Date().toISOString()
                              });
                            }}
                            className="hidden"
                            accept={getAcceptAttribute(q.validation?.fileTypes)}
                          />
                          
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-xl">📎</span>
                            </div>
                            
                            {!responses[q.id]?.files?.length ? (
                              <>
                                <p className="text-sm text-gray-600 mb-2">
                                  {q.validation?.multiple ? 'Select files to upload' : 'Select a file to upload'}
                                </p>
                                <label
                                  htmlFor={`file-${q.id}`}
                                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
                                >
                                  <span>Choose File{q.validation?.multiple && 's'}</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                  Max size: {q.validation?.maxSize || 10}MB • {
                                    q.validation?.fileTypes === 'all' ? 'All files' : 
                                    q.validation?.fileTypes === 'image' ? 'Images only' :
                                    q.validation?.fileTypes === 'document' ? 'Documents only' :
                                    q.validation?.fileTypes === 'pdf' ? 'PDF only' :
                                    q.validation?.fileTypes === 'video' ? 'Videos only' :
                                    q.validation?.fileTypes === 'audio' ? 'Audio only' : 'All files'
                                  }
                                </p>
                              </>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-green-600">
                                  {responses[q.id].files.length} file{responses[q.id].files.length > 1 ? 's' : ''} selected
                                </p>
                                
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {responses[q.id].files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm">📄</span>
                                        <div>
                                          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                            {file.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedFiles = responses[q.id].files.filter((_, i) => i !== index);
                                          if (updatedFiles.length === 0) {
                                            const newResponses = { ...responses };
                                            delete newResponses[q.id];
                                            setResponses(newResponses);
                                          } else {
                                            handleChange(q.id, {
                                              ...responses[q.id],
                                              files: updatedFiles
                                            });
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1 rounded"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="flex space-x-2 justify-center">
                                  <label
                                    htmlFor={`file-${q.id}`}
                                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm cursor-pointer transition-colors"
                                  >
                                    Add More
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newResponses = { ...responses };
                                      delete newResponses[q.id];
                                      setResponses(newResponses);
                                    }}
                                    className="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    Clear All
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <button
          onClick={submit}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          <span>Submit Assessment</span>
          <span>→</span>
        </button>
        <p className="text-sm text-gray-600 mt-3">
          Please review all your answers before submitting
        </p>
      </div>
    </div>
  );
}