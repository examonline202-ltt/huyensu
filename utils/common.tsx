
import React from 'react';
import { Question, StudentResult, ExamConfig, Student } from '../types';

// --- CSS Animations cho UI Động ---
const EXTRA_STYLES = `
  @keyframes timer-bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); color: #ef4444; border-color: #fca5a5; }
  }
  .timer-urgent {
    animation: timer-bounce 0.6s infinite ease-in-out;
  }
  
  /* Đảm bảo Code Block trông chuyên nghiệp */
  .code-ide-container {
    background: #1e1e1e !important;
    border-radius: 12px;
    margin: 1rem 0; /* Reduced margin to fit options better */
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    overflow: hidden;
    border: 1px solid #333;
    width: 100%;
    max-width: 100%;
  }
  
  /* Đảm bảo giữ nguyên indent và xuống dòng trong pre/code */
  .code-ide-container pre, .code-ide-container code {
    white-space: pre !important; 
    tab-size: 4;
    font-family: 'Fira Code', 'Consolas', monospace !important;
  }

  /* Style cho Inline Code (Cặp nháy đơn) */
  .inline-code {
    background-color: #f1f5f9;
    color: #e11d48;
    padding: 0.1em 0.4em;
    border-radius: 6px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
    border: 1px solid #e2e8f0;
    font-weight: 600;
    display: inline-block; /* Ensure it behaves nicely inline */
    vertical-align: middle;
    margin: 0 2px;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = EXTRA_STYLES;
  document.head.appendChild(styleSheet);
}

export const LATEX_MATH_CONFIG = {
  "name": "plain_text_generator",
  "version": "2.0",
  "description": "Sinh nội dung văn bản thuần, không dùng LaTeX hay Table phức tạp.",
  "output_rules": {
    "format": "plain_text_markdown",
    "math_syntax": "standard_text (e.g., x = 5)",
    "tables": "forbidden (use lists instead)"
  }
};

// Robust Library Loading
export const loadExternalLibs = async () => {
  // Pre-configure MathJax
  if (!(window as any).MathJax) {
    (window as any).MathJax = {
      tex: {
        inlineMath: [['\\(', '\\)'], ['$', '$']],
        displayMath: [['\\[', '\\]'], ['$$', '$$']]
      },
      startup: { typeset: false }
    };
  }

  const libs = [
    { global: 'mammoth', src: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js' },
    { global: 'XLSX', src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js' },
    { global: 'MathJax', src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' },
    { global: 'docx', src: 'https://cdn.jsdelivr.net/npm/docx@7.1.0/build/index.js' } // Revert to 7.1.0 for stability
  ];

  const loadOne = (lib: {global: string, src: string}) => new Promise((resolve) => {
      // If global exists, resolve immediately
      if ((window as any)[lib.global]) return resolve(true);
      
      // Check if script tag is already in DOM
      const existing = document.querySelector(`script[src="${lib.src}"]`);
      if (existing) {
          // Poll until global variable is available
          let checks = 0;
          const timer = setInterval(() => {
              if ((window as any)[lib.global]) { clearInterval(timer); resolve(true); }
              else if (checks++ > 100) { clearInterval(timer); resolve(false); } // ~10s timeout
          }, 100);
          return;
      }

      const script = document.createElement('script');
      script.src = lib.src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(true);
      script.onerror = () => {
          console.warn(`Failed to load script: ${lib.src}`);
          resolve(false);
      };
      document.head.appendChild(script);
  });

  await Promise.all(libs.map(loadOne));
  
  // Verify critical libs
  return !!((window as any).docx && (window as any).XLSX);
};

const CodeBlock: React.FC<{ code: string, language: string }> = ({ code, language }) => {
  const codeRef = React.useRef<HTMLElement>(null);
  
  const langMap: Record<string, string> = {
    'python': 'python',
    'py': 'python',
    'sql': 'sql',
    'cpp': 'cpp',
    'c++': 'cpp',
    'c': 'c',
    'h': 'c',
    'css': 'css',
    'html': 'markup',
    'xml': 'markup',
    'javascript': 'javascript',
    'js': 'javascript',
    'ts': 'javascript',
    'java': 'java',
    'json': 'json',
    'bash': 'bash',
    'sh': 'bash',
    'c#': 'csharp',
    'cs': 'csharp',
    'csharp': 'csharp',
    'pascal': 'pascal',
    'objectpascal': 'pascal',
    'delphi': 'pascal'
  };

  const cleanLang = (language || '').toLowerCase().trim();
  const displayLang = langMap[cleanLang] || 'python'; // Default to python if unknown for IT context

  React.useEffect(() => {
    if ((window as any).Prism && codeRef.current) {
      try {
        (window as any).Prism.highlightElement(codeRef.current);
      } catch (e) {
        console.error("Prism highlight error:", e);
      }
    }
  }, [code, displayLang]);

  return (
    <div className="code-ide-container animate-fade-in my-2">
      <div className="flex items-center justify-between border-b border-[#333] bg-[#252526] px-2 py-1.5">
        <div className="ide-dots">
          <div className="ide-dot dot-red"></div>
          <div className="ide-dot dot-yellow"></div>
          <div className="ide-dot dot-green"></div>
        </div>
        <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-80">
          {cleanLang || 'CODE'}
        </div>
      </div>
      
      <div className="p-3 overflow-x-auto bg-[#1e1e1e]">
        <pre className={`language-${displayLang} !m-0 !p-0`}>
          <code ref={codeRef} className={`language-${displayLang}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const MathRenderer: React.FC<{ text: string, allowMarkdown?: boolean }> = React.memo(({ text, allowMarkdown = false }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  
  React.useEffect(() => {
    if (typeof text !== 'string') return;
    if ((window as any).MathJax?.typesetPromise && containerRef.current) {
        (window as any).MathJax.typesetPromise([containerRef.current]).catch(() => {});
    }
  }, [text]);

  if (typeof text !== 'string') return null;
  if (!allowMarkdown) return <span ref={containerRef}>{text}</span>;

  // Helper xử lý Bold, Italic trong dòng
  const processInlineStyles = (str: string) => {
      // 1. Bold: **text**
      const boldParts = str.split(/(\*\*[^\*]+\*\*)/g);
      return boldParts.map((bp, bIdx) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={bIdx} className="font-bold text-inherit">{bp.slice(2, -2)}</strong>;
          }
          // 2. Italic: *text* (chỉ khi không chứa dấu * khác)
          const italicParts = bp.split(/(\*[^\*]+\*)/g);
          return italicParts.map((ip, iIdx) => {
              if (ip.startsWith('*') && ip.endsWith('*') && ip.length > 2) {
                  return <em key={`${bIdx}-${iIdx}`} className="italic text-inherit">{ip.slice(1, -1)}</em>;
              }
              return ip;
          });
      });
  };

  // Helper xử lý Inline Markdown (Code inline `code` và Styles)
  const processInlineMarkdown = (lineContent: string, keyPrefix: string) => {
      // Tách bởi regex inline code: `code`
      // Regex này bắt cặp dấu ` nhưng không bắt nếu nó là ``` (Code block)
      // Do chúng ta đã xử lý Code Block trước đó bằng cách tách dòng, nên ở đây chỉ còn inline code.
      const regex = /(`[^`]+`)/g;
      const parts = lineContent.split(regex);
      
      return parts.map((part, idx) => {
          if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={`${keyPrefix}-${idx}`} className="inline-code">{part.slice(1, -1)}</code>;
          }
          return (
              <span key={`${keyPrefix}-${idx}`}>
                  {processInlineStyles(part)} 
              </span>
          );
      });
  };

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = '';

  for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block detection: ```lang
      // Chỉ bắt đầu nếu dòng bắt đầu bằng ``` (có thể có khoảng trắng)
      // Lưu ý: Nếu inline code nằm ở đầu dòng thì `trimmed.startsWith` cũng có thể nhầm nếu regex không tốt.
      // Nhưng Markdown chuẩn thì Code Block Fence phải là ``` ở đầu dòng. Inline code thì ` ở đầu dòng.
      if (trimmed.startsWith('```')) {
          if (inCodeBlock) {
              // Kết thúc block
              elements.push(<CodeBlock key={`cb-${i}`} code={codeBlockLines.join('\n')} language={codeBlockLang} />);
              inCodeBlock = false;
              codeBlockLines = [];
              codeBlockLang = '';
          } else {
              // Bắt đầu block
              inCodeBlock = true;
              codeBlockLang = trimmed.slice(3).trim();
          }
          continue;
      }

      if (inCodeBlock) {
          codeBlockLines.push(line);
          continue;
      }

      const key = `line-${i}`;

      // Headers
      if (trimmed.startsWith('### ')) {
          elements.push(<h3 key={key} className="text-sm font-bold text-indigo-700 mt-2 mb-1">{processInlineMarkdown(trimmed.substring(4), key)}</h3>);
          continue;
      }
      if (trimmed.startsWith('## ')) {
          elements.push(<h2 key={key} className="text-base font-bold text-indigo-800 mt-3 mb-1">{processInlineMarkdown(trimmed.substring(3), key)}</h2>);
          continue;
      }
      if (trimmed.startsWith('# ')) {
          elements.push(<h1 key={key} className="text-lg font-black text-indigo-900 mt-4 mb-2">{processInlineMarkdown(trimmed.substring(2), key)}</h1>);
          continue;
      }

      // Lists (* or -)
      if (/^[\*\-]\s/.test(trimmed)) {
          elements.push(
              <div key={key} className="flex gap-2 ml-4 mb-1">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>{processInlineMarkdown(trimmed.substring(2), key)}</span>
              </div>
          );
          continue;
      }

      // Numbered Lists (1.)
      const numMatch = trimmed.match(/^(\d+\.)\s(.*)/);
      if (numMatch) {
          elements.push(
              <div key={key} className="flex gap-2 ml-4 mb-1">
                  <span className="text-indigo-600 font-bold">{numMatch[1]}</span>
                  <span>{processInlineMarkdown(numMatch[2], key)}</span>
              </div>
          );
          continue;
      }

      // Dòng trống (nhưng nếu dòng có khoảng trắng thì không coi là trống để giữ format nếu cần)
      if (!line && !trimmed) {
          elements.push(<div key={key} className="h-1"></div>);
          continue;
      }

      // Văn bản thường: Render trong div nhưng nội dung bên trong (bao gồm inline code) sẽ nằm cùng dòng (do span/code là inline)
      elements.push(<div key={key} className="min-h-[1.5em]">{processInlineMarkdown(line, key)}</div>);
  }

  // Handle unclosed code block (fallback)
  if (inCodeBlock && codeBlockLines.length > 0) {
       elements.push(<CodeBlock key={`cb-end`} code={codeBlockLines.join('\n')} language={codeBlockLang} />);
  }

  return <span ref={containerRef} className="block w-full">{elements}</span>;
});

export const SmartTextRenderer = ({ text }: { text: string }) => {
    if (typeof text !== 'string') return null;
    return <div className="space-y-1.5 text-gray-700 w-full"><MathRenderer text={text} allowMarkdown={true} /></div>;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => alert("Đã sao chép!")).catch(() => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert("Đã sao chép!");
  });
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const exportResultsToExcel = async (results: StudentResult[], title: string) => {
  if (!(window as any).XLSX) await loadExternalLibs();
  
  const XLSX = (window as any).XLSX;
  if (!XLSX) return alert("Thư viện Excel chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng.");
  
  const data = results.map((res, idx) => ({
    "STT": idx + 1,
    "Họ và Tên": res.name,
    "Lớp": res.className,
    "Điểm": res.score,
    "Đúng": res.counts?.correct || 0,
    "Sai": res.counts?.wrong || 0,
    "Thời gian": res.timeSpent || 0,
    "Vi phạm": res.violations || 0
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ket_Qua");
  XLSX.writeFile(wb, `Ket_Qua_${title.replace(/\s+/g, '_')}.xlsx`);
};

export const exportStudentsToExcel = async (students: Student[]) => {
  if (!(window as any).XLSX) await loadExternalLibs();
  
  const XLSX = (window as any).XLSX;
  if (!XLSX) return alert("Thư viện Excel chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng.");
  
  const data = students.map((s, idx) => ({
    "STT": idx + 1,
    "Họ và Tên": s.name,
    "Lớp": s.className,
    "Email/Tài khoản": s.email || '',
    "Trạng thái": s.isApproved ? "Đã duyệt" : "Chờ duyệt"
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh_Sach_Hoc_Sinh");
  XLSX.writeFile(wb, `Danh_Sach_Hoc_Sinh_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
};

export const exportExamToDocx = async (exam: ExamConfig) => {
    try {
        if (!(window as any).docx) await loadExternalLibs();
        
        const docx = (window as any).docx;
        if (!docx) return alert("Thư viện Word chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng hoặc thử lại.");
        
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = docx;

        const base64ToBuffer = (base64: string) => {
            if (!base64) return null;
            try {
                let cleanBase64 = base64.replace(/\s/g, '');
                const commaIndex = cleanBase64.indexOf(',');
                if (commaIndex !== -1) {
                    cleanBase64 = cleanBase64.substring(commaIndex + 1);
                }
                const binaryString = window.atob(cleanBase64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes;
            } catch (e) {
                return null;
            }
        };

        const createRichTextParagraphs = (rawText: string, imageBase64?: string, prefix: string = '', indentLeft: number = 0) => {
            const paragraphs = [];
            const parts = rawText.split(/```/); 

            parts.forEach((part, index) => {
                const isCodeBlock = index % 2 === 1;

                if (isCodeBlock) {
                    let lines = part.split('\n');
                    
                    let lang = '';
                    if (lines.length > 0) {
                        const firstLineTrimmed = lines[0].trim();
                        if (/^[a-zA-Z0-9+#]+$/.test(firstLineTrimmed) && firstLineTrimmed.length < 15) {
                            lang = firstLineTrimmed;
                            lines.shift(); 
                        } else if (firstLineTrimmed === '') {
                            lines.shift();
                        }
                    }
                    
                    if (lines.length > 0 && lines[lines.length-1].trim() === '') {
                        lines.pop();
                    }

                    if (lang) {
                        paragraphs.push(new Paragraph({
                            children: [ new TextRun({ text: "```" + lang, font: "Courier New", size: 22 }) ],
                            indent: { left: indentLeft + 720 },
                            spacing: { after: 0, line: 240 } 
                        }));
                    } else {
                         paragraphs.push(new Paragraph({
                            children: [ new TextRun({ text: "```", font: "Courier New", size: 22 }) ],
                            indent: { left: indentLeft + 720 },
                            spacing: { after: 0, line: 240 } 
                        }));
                    }

                    lines.forEach(line => {
                        paragraphs.push(new Paragraph({
                            children: [ new TextRun({ text: line, font: "Courier New", size: 22 }) ],
                            indent: { left: indentLeft + 720 },
                            spacing: { after: 0, line: 240 }
                        }));
                    });

                    paragraphs.push(new Paragraph({
                        children: [ new TextRun({ text: "```", font: "Courier New", size: 22 }) ],
                        indent: { left: indentLeft + 720 },
                        spacing: { after: 100, line: 240 }
                    }));

                } else {
                    if (!part && index !== 0) return; 

                    const textContent = part;
                    const runs = [];
                    
                    if (index === 0 && prefix) {
                        runs.push(new TextRun({ text: prefix, bold: true }));
                    }
                    
                    const lines = textContent.split('\n');
                    lines.forEach((line, lineIdx) => {
                        if (lineIdx > 0) runs.push(new TextRun({ break: 1 }));
                        runs.push(new TextRun({ text: line }));
                    });

                    if (runs.length > 0) {
                        paragraphs.push(new Paragraph({
                            children: runs,
                            indent: { left: indentLeft },
                            spacing: { after: 100 }
                        }));
                    }
                }
            });

            if (imageBase64) {
                const imgBuffer = base64ToBuffer(imageBase64);
                if (imgBuffer) {
                    try {
                        paragraphs.push(new Paragraph({
                            children: [ new ImageRun({ data: imgBuffer, transformation: { width: 300, height: 200 } }) ],
                            indent: { left: indentLeft + 360 }
                        }));
                    } catch (imgError) {}
                }
            }

            return paragraphs;
        };

        const sections = [ "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN", "PHẦN II. CÂU HỎI ĐÚNG - SAI", "PHẦN III. TRẢ LỜI NGẮN", "KHÁC" ];
        const docChildren = [];

        docChildren.push(
            new Paragraph({ text: exam.title.toUpperCase(), heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
            new Paragraph({ text: `Mã đề: ${exam.code} | Thời gian: ${exam.duration} phút`, alignment: AlignmentType.CENTER, spacing: { after: 300 } })
        );

        let globalIndex = 1;

        sections.forEach(secTitle => {
            const questions = exam.questions.filter(q => (q.section || "KHÁC") === secTitle);
            if (questions.length === 0) return;

            docChildren.push(new Paragraph({ text: secTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }));

            questions.forEach((q) => {
                const qParagraphs = createRichTextParagraphs(q.question, q.image, `Câu ${globalIndex}. `, 0);
                if (qParagraphs) docChildren.push(...qParagraphs);
                globalIndex++;

                if (q.type === 'choice' && q.options) {
                    q.options.forEach((opt, i) => {
                        const label = String.fromCharCode(65 + i); 
                        const isCorrect = q.answer === opt;
                        const optParagraphs = createRichTextParagraphs(opt, q.optionImages?.[i], `${isCorrect ? '*' : ''}${label}. `, 720);
                        if (optParagraphs) docChildren.push(...optParagraphs);
                    });
                } else if (q.type === 'group' && q.subQuestions) {
                    q.subQuestions.forEach((sub, i) => {
                        const label = String.fromCharCode(97 + i); 
                        const isCorrect = sub.correctAnswer === true;
                        const subParagraphs = createRichTextParagraphs(sub.content, undefined, `${isCorrect ? '*' : ''}${label}) `, 720);
                        if (subParagraphs) docChildren.push(...subParagraphs);
                    });
                } else if (q.type === 'text') {
                     docChildren.push(new Paragraph({ children: [ new TextRun({ text: "Đáp án: ", bold: true, italics: true }), new TextRun(q.answer || "") ], indent: { left: 720 } }));
                }
                docChildren.push(new Paragraph({ text: "" }));
            });
        });

        const doc = new Document({ sections: [{ properties: {}, children: docChildren }] });

        Packer.toBlob(doc).then((blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${exam.title.replace(/\s+/g, '_')}_CodeSupported.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }).catch(err => alert("Lỗi khi tạo file Word: " + err.message));
    } catch (e: any) {
        alert("Có lỗi xảy ra khi xuất file Word: " + e.message);
    }
};

export const parseWordSmart = (content: string): Question[] => {
  if (typeof content !== 'string') return [];
  
  // Use regex to keep empty lines significant for code blocks
  const lines = content.split('\n');
  const newQuestions: Question[] = [];
  
  let currentSection = "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN";
  let currentType: 'choice' | 'group' | 'text' = 'choice';
  let currentQ: Partial<Question> | null = null;
  let parserState: 'question' | 'option' | 'subQ' = 'question';
  
  // Flag to detect code blocks
  let inCodeBlock = false;
  
  const sectionRegex = /^PHẦN\s+(I|II|III|IV|V|A|B|C|D)[\.:]?\s*(.*)/i;
  const qStartRegex = /^(Câu|Question)\s*\d+[:.]/i;
  const optRegex = /^(\*)?\s*([A-D])[\.\)]\s*(.*)/;
  const subQRegex = /^(\*)?\s*([a-d])[\.\)]\s*(.*)/i;
  const trueRegex = /[\(\[]?\s*(Đúng|True|Đ)\s*[\)\]]?$/i;
  const falseRegex = /[\(\[]?\s*(Sai|False|S)\s*[\)\]]?$/i;

  const ensureGroupStructure = (q: Partial<Question>) => {
      if (q.type === 'group') {
          q.subQuestions = q.subQuestions || [];
          const needed = 4 - q.subQuestions.length;
          for (let k = 0; k < needed; k++) {
              q.subQuestions.push({
                  id: Date.now() + Math.random().toString() + k,
                  content: "",
                  correctAnswer: false
              });
          }
          if (q.subQuestions.length > 4) q.subQuestions = q.subQuestions.slice(0, 4);
      }
      return q as Question;
  };

  lines.forEach(line => {
    // Check for code block toggle marks (```)
    // IMPORTANT: Check BEFORE trimming for code block logic, but we need to track state
    if (line.includes('```')) {
        inCodeBlock = !inCodeBlock;
    }

    const trimmed = line.trim();
    
    // LOGIC: If inside a code block, preserve indent and structure strictly.
    // Do NOT attempt to detect Question/Option markers inside a code block.
    if (inCodeBlock) {
        if (currentQ) {
             // Tự động bỏ qua dòng trống trong code block để gọn gàng
             if (!trimmed) return;

             // Append raw line (including indentation) to the current active field
             if (parserState === 'option' && currentQ.options && currentQ.options.length > 0) {
                 currentQ.options[currentQ.options.length - 1] += "\n" + line;
             } else if (parserState === 'subQ' && currentQ.subQuestions && currentQ.subQuestions.length > 0) {
                 currentQ.subQuestions[currentQ.subQuestions.length - 1].content += "\n" + line;
             } else {
                 currentQ.question += "\n" + line;
             }
        }
        return; // Skip standard parsing for this line
    }

    // Standard Parsing Logic (Outside Code Block)
    if (!trimmed) {
        // Optional: preserve empty lines in normal text too if needed
        return; 
    }

    const secMatch = trimmed.match(sectionRegex);
    if (secMatch) {
        currentSection = trimmed.toUpperCase(); 
        const titleContent = secMatch[2].toUpperCase();
        
        if (titleContent.includes("ĐÚNG") && titleContent.includes("SAI")) {
            currentType = 'group';
        } else if (titleContent.includes("TRẢ LỜI NGẮN") || titleContent.includes("TỰ LUẬN")) {
            currentType = 'text';
        } else {
            currentType = 'choice';
        }
        return; 
    }

    if (qStartRegex.test(trimmed)) {
       if (currentQ) {
           newQuestions.push(ensureGroupStructure(currentQ));
       }
       
       currentQ = { 
           id: Date.now() + Math.random(), 
           question: trimmed.replace(qStartRegex, "").trim(), 
           section: currentSection,
           type: currentType, 
           options: [], 
           subQuestions: [],
           answer: '', 
           mixQuestion: true, 
           mixOptions: true 
       };
       parserState = 'question';
    } 
    else if (currentQ) {
       if (currentQ.type === 'choice') {
           const match = trimmed.match(optRegex);
           if (match) {
               const text = match[3].trim();
               currentQ.options?.push(text);
               if (match[1]) currentQ.answer = text; 
               parserState = 'option';
           } else {
               if (parserState === 'option' && currentQ.options && currentQ.options.length > 0) {
                   // Append trimmed line for normal text to keep it clean, or line if you want to be strict
                   currentQ.options[currentQ.options.length - 1] += "\n" + line;
               } else {
                   currentQ.question += "\n" + line;
               }
           }
       } else if (currentQ.type === 'group') {
           const match = trimmed.match(subQRegex);
           if (match) {
               const content = match[3].trim();
               const isTrue = trueRegex.test(content);
               const isFalse = falseRegex.test(content);
               let cleanContent = content;
               let ans = false;

               if (match[1]) {
                   ans = true;
               }

               if (isTrue) { ans = true; cleanContent = content.replace(trueRegex, "").trim(); }
               if (isFalse) { ans = false; cleanContent = content.replace(falseRegex, "").trim(); }
               
               currentQ.subQuestions?.push({
                   id: Date.now() + Math.random().toString(),
                   content: cleanContent,
                   correctAnswer: ans
               });
               parserState = 'subQ';
           } else {
                if (parserState === 'subQ' && currentQ.subQuestions && currentQ.subQuestions.length > 0) {
                   currentQ.subQuestions[currentQ.subQuestions.length - 1].content += "\n" + line;
               } else {
                   currentQ.question += "\n" + line;
               }
           }
       } else if (currentQ.type === 'text') {
           if (trimmed.startsWith('ĐÁP ÁN:') || trimmed.startsWith('Đáp án:') || trimmed.startsWith('HD:')) {
               currentQ.answer = trimmed.replace(/^(ĐÁP ÁN|Đáp án|HD):/i, "").trim();
           } else {
               currentQ.question += "\n" + line;
           }
       }
    }
  });

  if (currentQ) {
      newQuestions.push(ensureGroupStructure(currentQ));
  }

  return newQuestions;
};

export const generateSecurityCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const parseStudentImport = (text: string): Student[] => {
    const lines = text.split('\n');
    const students: Student[] = [];
    lines.forEach(line => {
        const parts = line.split('\t');
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const className = parts[1].trim();
            const email = parts[2]?.trim() || null;
            if (name && className) {
                students.push({
                    id: Date.now() + Math.random().toString(),
                    name,
                    className,
                    email,
                    isApproved: false
                });
            }
        }
    });
    return students;
};

/**
 * Converts a UTC ISO string (or any date string) to a Local ISO string format (YYYY-MM-DDTHH:mm).
 * Used for input[type="datetime-local"] which expects local time value.
 */
export const toLocalISOString = (dateString: string | undefined | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Create a new date object shifted by the timezone offset
  // so that .toISOString() returns the local time numbers
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  
  return localDate.toISOString().slice(0, 16);
};

/**
 * Formats a date string to VN format: HH:mm dd/MM/yyyy
 */
export const formatDateTimeVN = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(',', '');
};
