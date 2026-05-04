import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const templates = {
    minimal: {
      name: 'Minimal',
      className: 'template-minimal',
      description: 'Clean and simple design',
      preview: {
        name: 'John Doe',
        title: 'Software Engineer',
        contact: 'john@example.com • (555) 123-4567',
        summary: 'Experienced software engineer with 5+ years in web development.',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 'Senior Developer at Tech Corp (2020-Present)'
      }
    },
    modern: {
      name: 'Modern',
      className: 'template-modern',
      description: 'Contemporary with colored sidebar',
      preview: {
        name: 'Sarah Johnson',
        title: 'Product Manager',
        contact: 'sarah@example.com • (555) 987-6543',
        summary: 'Strategic product manager driving user-centric solutions.',
        skills: ['Product Strategy', 'Analytics', 'Agile'],
        experience: 'Product Lead at Startup Inc (2019-Present)'
      }
    },
    professional: {
      name: 'Professional',
      className: 'template-professional',
      description: 'Corporate business style',
      preview: {
        name: 'Michael Chen',
        title: 'Marketing Director',
        contact: 'michael@example.com • (555) 456-7890',
        summary: 'Results-driven marketing executive with proven track record.',
        skills: ['Digital Marketing', 'Brand Strategy', 'Leadership'],
        experience: 'Director of Marketing at Global Corp (2018-Present)'
      }
    },
    creative: {
      name: 'Creative',
      className: 'template-creative',
      description: 'Design-focused with visual elements',
      preview: {
        name: 'Emma Davis',
        title: 'UX Designer',
        contact: 'emma@example.com • (555) 321-0987',
        summary: 'Creative UX designer passionate about user experience.',
        skills: ['UI/UX Design', 'Figma', 'Prototyping'],
        experience: 'Senior UX Designer at Design Studio (2021-Present)'
      }
    }
  };

  const extractTextFromPDF = async (file) => {
    // Simplified - just return filename for now
    return `Resume from ${file.name}`;
  };

  const extractTextFromDOC = async (file) => {
    // Simplified - just return filename for now
    return `Resume from ${file.name}`;
  };

  const parseResumeData = (text) => {
    // Simple parsing - just extract basic info from filename or placeholder
    return {
      name: text.includes('Resume from') ? text.replace('Resume from ', '').replace(/\.(pdf|doc|docx)$/i, '') : '',
      email: '',
      phone: '',
      location: '',
      summary: 'Professional summary will be enhanced with AI.',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: [{
        title: 'Software Developer',
        company: 'Tech Company',
        duration: '2020 - Present',
        description: 'Developed web applications and improved user experience.'
      }],
      education: [{
        degree: 'Bachelor of Science',
        school: 'University Name',
        year: '2020'
      }],
      projects: []
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        try {
          extractedText = await extractTextFromPDF(file);
        } catch (pdfError) {
          console.warn('PDF parsing failed, using filename as fallback:', pdfError);
          extractedText = file.name.replace(/\.(pdf|PDF)$/, '').replace(/[-_]/g, ' ');
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 file.type === 'application/msword') {
        try {
          extractedText = await extractTextFromDOC(file);
        } catch (docError) {
          console.warn('DOC parsing failed, using filename as fallback:', docError);
          extractedText = file.name.replace(/\.(doc|docx|DOC|DOCX)$/, '').replace(/[-_]/g, ' ');
        }
      } else {
        alert('Unsupported file type. Please upload PDF or DOC/DOCX files.');
        setIsProcessing(false);
        return;
      }

      const parsedData = parseResumeData(extractedText);
      setResumeData(prev => ({ ...prev, ...parsedData }));

      alert('Resume uploaded successfully! You can now edit the information and choose a template.');

    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. The resume builder will still work - you can fill in the information manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, template = {}) => {
    setResumeData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const enhanceWithAI = async () => {
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        summary: prev.summary ? `Enhanced: ${prev.summary}` : 'Professional summary enhanced with AI suggestions.',
        skills: [...new Set([...prev.skills, 'Leadership', 'Problem Solving'])]
      }));
      setIsProcessing(false);
    }, 2000);
  };

  const exportToPDF = async () => {
    if (!previewRef.current) {
      alert('Preview not available. Please fill in some resume data first.');
      return;
    }

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  return (
    <div id="resume-builder" className="page-wrap">
      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>📄 AI Resume Builder</h1>
            <p>Upload your resume and let AI help you create a professional, modern resume with multiple templates.</p>
            <div className="tool-badges">
              <span className="badge">✓ AI-Powered</span>
              <span className="badge">✓ Multiple Templates</span>
              <span className="badge">✓ Live Preview</span>
              <span className="badge">✓ PDF Export</span>
            </div>
          </div>

          <div className="tool-body">
            {/* Template Selection */}
            <div className="format-group">
              <label htmlFor="template-select">Choose Template</label>
              <div className="template-grid">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    className={`template-option ${selectedTemplate === key ? 'selected' : ''}`}
                    onClick={() => setSelectedTemplate(key)}
                    aria-pressed={selectedTemplate === key}
                  >
                    <div className="template-preview">
                      <div className={`template-sample ${template.className}`}>
                        <div className="preview-header">
                          <div className="preview-name">{template.preview.name}</div>
                          <div className="preview-title">{template.preview.title}</div>
                        </div>
                        <div className="preview-contact">{template.preview.contact}</div>
                        <div className="preview-summary">{template.preview.summary}</div>
                        <div className="preview-skills">
                          {template.preview.skills.map((skill, index) => (
                            <span key={index} className="preview-skill">{skill}</span>
                          ))}
                        </div>
                        <div className="preview-experience">{template.preview.experience}</div>
                      </div>
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="upload-section">
              <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="drop-zone-content">
                  <div className="upload-icon">📎</div>
                  <h3>Upload Your Resume</h3>
                  <p>Drop PDF or DOC/DOCX files here, or click to browse</p>
                  <p className="file-types">Supported: PDF, DOC, DOCX</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <p>AI is processing your resume...</p>
                </div>
              )}
            </div>

            {/* Main Builder Interface */}
            <div className="resume-builder-layout">
              {/* Form Panel */}
              <div className="form-panel">
                <div className="form-tabs">
                  {['personal', 'experience', 'education', 'skills', 'projects'].map(section => (
                    <button
                      key={section}
                      className={`form-tab ${activeSection === section ? 'active' : ''}`}
                      onClick={() => setActiveSection(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="form-content">
                  {activeSection === 'personal' && (
                    <div className="form-section">
                      <h3>Personal Information</h3>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={resumeData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={resumeData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={resumeData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={resumeData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="New York, NY"
                        />
                      </div>
                      <div className="form-group">
                        <label>Professional Summary</label>
                        <textarea
                          value={resumeData.summary}
                          onChange={(e) => handleInputChange('summary', e.target.value)}
                          placeholder="Brief professional summary..."
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === 'experience' && (
                    <div className="form-section">
                      <h3>Work Experience</h3>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                          <div className="form-group">
                            <label>Job Title</label>
                            <input
                              type="text"
                              value={exp.title || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, title: e.target.value })}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div className="form-group">
                            <label>Company</label>
                            <input
                              type="text"
                              value={exp.company || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, company: e.target.value })}
                              placeholder="Tech Corp"
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayItem('experience', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', description: '' })}
                      >
                        + Add Experience
                      </button>
                    </div>
                  )}

                  {activeSection === 'education' && (
                    <div className="form-section">
                      <h3>Education</h3>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="education-item">
                          <div className="form-group">
                            <label>Degree</label>
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => handleArrayChange('education', index, { ...edu, degree: e.target.value })}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div className="form-group">
                            <label>School</label>
                            <input
                              type="text"
                              value={edu.school || ''}
                              onChange={(e) => handleArrayChange('education', index, { ...edu, school: e.target.value })}
                              placeholder="University Name"
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayItem('education', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })}
                      >
                        + Add Education
                      </button>
                    </div>
                  )}

                  {activeSection === 'skills' && (
                    <div className="form-section">
                      <h3>Skills</h3>
                      <div className="skills-input">
                        <input
                          type="text"
                          placeholder="Add a skill and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              setResumeData(prev => ({
                                ...prev,
                                skills: [...prev.skills, e.target.value.trim()]
                              }));
                              e.target.value = '';
                            }
                          }}
                        />
                        <div className="skills-list">
                          {resumeData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                              <button
                                type="button"
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'projects' && (
                    <div className="form-section">
                      <h3>Projects</h3>
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className="project-item">
                          <div className="form-group">
                            <label>Project Name</label>
                            <input
                              type="text"
                              value={project.name || ''}
                              onChange={(e) => handleArrayChange('projects', index, { ...project, name: e.target.value })}
                              placeholder="Project Title"
                            />
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={project.description || ''}
                              onChange={(e) => handleArrayChange('projects', index, { ...project, description: e.target.value })}
                              placeholder="Project description..."
                              rows={3}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayItem('projects', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '' })}
                      >
                        + Add Project
                      </button>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-convert"
                    onClick={enhanceWithAI}
                    disabled={isProcessing}
                  >
                    {isProcessing ? '🤖 Enhancing...' : '✨ Improve with AI'}
                  </button>
                  <button
                    type="button"
                    className="btn-convert"
                    onClick={exportToPDF}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="preview-panel">
                <div className="preview-header">
                  <h3>Resume Preview</h3>
                </div>
                <div className="resume-preview-container">
                  <div
                    ref={previewRef}
                    className={`resume-preview ${templates[selectedTemplate].className}`}
                  >
                    {/* Resume Template Rendering */}
                    <div className="resume-content">
                      {/* Header */}
                      <div className="resume-header">
                        <h1 className="resume-name">{resumeData.name || 'Your Name'}</h1>
                        <div className="resume-contact">
                          {resumeData.email && <span>{resumeData.email}</span>}
                          {resumeData.phone && <span>{resumeData.phone}</span>}
                          {resumeData.location && <span>{resumeData.location}</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resumeData.summary && (
                        <div className="resume-section">
                          <h2>Professional Summary</h2>
                          <p>{resumeData.summary}</p>
                        </div>
                      )}

                      {/* Skills */}
                      {resumeData.skills.length > 0 && (
                        <div className="resume-section">
                          <h2>Skills</h2>
                          <div className="skills-display">
                            {resumeData.skills.map((skill, index) => (
                              <span key={index} className="skill-item">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {resumeData.experience.length > 0 && (
                        <div className="resume-section">
                          <h2>Experience</h2>
                          {resumeData.experience.map((exp, index) => (
                            <div key={index} className="experience-entry">
                              <h3>{exp.title || 'Job Title'}</h3>
                              <p className="company">{exp.company || 'Company Name'}</p>
                              <p>{exp.description || 'Job description...'}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {resumeData.education.length > 0 && (
                        <div className="resume-section">
                          <h2>Education</h2>
                          {resumeData.education.map((edu, index) => (
                            <div key={index} className="education-entry">
                              <h3>{edu.degree || 'Degree'}</h3>
                              <p>{edu.school || 'School Name'}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Projects */}
                      {resumeData.projects.length > 0 && (
                        <div className="resume-section">
                          <h2>Projects</h2>
                          {resumeData.projects.map((project, index) => (
                            <div key={index} className="project-entry">
                              <h3>{project.name || 'Project Name'}</h3>
                              <p>{project.description || 'Project description...'}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ResumeBuilder;