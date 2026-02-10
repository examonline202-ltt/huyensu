import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Share2, 
  LogOut, 
  FolderPlus, 
  Trash2, 
  Clock, 
  List, 
  Users, 
  FileUp, 
  Plus, 
  PlayCircle, 
  Edit, 
  ArrowLeft, 
  Copy, 
  BarChart3, 
  Search, 
  Download, 
  Filter, 
  Eye, 
  X, 
  UserPlus, 
  Upload, 
  BookOpen, 
  CircleCheck, 
  GraduationCap, 
  Calendar, 
  TriangleAlert, 
  Trophy, 
  FileText, 
  Bell, 
  UserMinus, 
  Check, 
  LogIn, 
  Lock, 
  Mail, 
  MoreHorizontal, 
  FileCode, 
  ChevronRight, 
  Settings, 
  Globe, 
  Info, 
  User, 
  FileSpreadsheet, 
  EyeOff, 
  ClipboardList, 
  Trash, 
  RefreshCw, 
  ShieldAlert, 
  Loader2, 
  Sparkles, 
  WandSparkles, 
  Type, 
  Key, 
  Send, 
  RotateCcw, 
  Calculator, 
  CheckSquare, 
  UploadCloud,
  Menu,
  Link,
  CheckCircle,
  XCircle,
  ChevronDown,
  Hourglass,
  Timer
} from 'lucide-react';
import { ExamConfig, Question, StudentResult, Student, User as UserType, QuestionType, SubQuestion } from '../types';
import { copyToClipboard, MathRenderer, loadExternalLibs, exportResultsToExcel, exportExamToDocx, exportStudentsToExcel, formatDateTimeVN } from '../utils/common';
import { EditQuestionModal, ImportModal, PublishExamModal, StudentModal, ImportStudentModal, AssignExamModal } from './Modals';
import { ResultScreen } from './Player';
import { dataService } from '../services/dataService';

const DASHBOARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    background-color: #f1f8f7;
    background-image: 
      radial-gradient(at 0% 0%, rgba(255,255,255,0.8) 0px, transparent 50%),
      radial-gradient(at 90% 90%, rgba(175, 238, 238, 0.4) 0px, transparent 60%);
    background-attachment: fixed;
    font-family: 'Be Vietnam Pro', sans-serif;
  }

  .font-poppins { font-family: 'Be Vietnam Pro', sans-serif !important; }
  
  .sidebar-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 4px;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .stat-card-3d {
    background: #ffffff;
    border-radius: 32px;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #eef2f6;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12);
    position: relative;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: default;
  }

  .stat-card-3d:hover {
    transform: translateY(-10px) rotate(-1.5deg) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
    border-color: #0d948830;
  }

  .stat-card-3d::before {
    content: '';
    position: absolute;
    bottom: -6px;
    right: -6px;
    width: 100%;
    height: 100%;
    background: #0d9488;
    border-radius: 32px;
    z-index: -1;
    box-shadow: 4px 4px 15px rgba(13, 148, 136, 0.3);
    transition: all 0.4s ease;
  }
  
  .stat-card-3d:hover::before {
    bottom: -10px;
    right: -10px;
    transform: rotate(1.5deg);
    opacity: 0.8;
  }

  .stat-icon-box-3d {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .stat-card-3d:hover .stat-icon-box-3d {
    transform: scale(1.1) rotate(8deg);
  }

  .exam-card {
    background: white;
    border-radius: 32px;
    border: 1px solid #f1f5f9;
    padding: 32px;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.12);
  }

  .exam-card:hover {
    transform: translateY(-12px) rotateZ(1.5deg) scale(1.02);
    box-shadow: 0 35px 70px -15px rgba(15, 23, 42, 0.2);
    border-color: #0d948860;
  }

  .rank-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 13px;
    color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .rank-1 { background: #facc15; }
  .rank-default { background: #94a3b8; }

  .score-text {
    font-size: 32px;
    font-weight: 900;
    color: #e11d48;
    font-family: 'Be Vietnam Pro', sans-serif;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
  }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1;
    transition: .4s;
    border-radius: 34px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 18px; width: 18px;
    left: 4px; bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .slider { background-color: #0d9488; }
  input:checked + .slider:before { transform: translateX(24px); }

  /* New Styles for Question Sections and Group Questions */
  .section-pill {
    background: #e0f2f1;
    color: #00897B;
    border: 1px solid #b2dfdb;
    padding: 8px 24px;
    border-radius: 99px;
    font-weight: 900;
    font-size: 14px;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    display: inline-block;
    margin-bottom: 24px;
  }

  .question-badge {
      background: #00897B;
      color: white;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 12px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 137, 123, 0.3);
  }

  .choice-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 12px;
  }
  @media (min-width: 768px) {
      .choice-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .choice-item-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      transition: all 0.2s ease;
  }
  .choice-item-box.correct {
      border-color: #00897B;
      background-color: #f0fdfa;
      box-shadow: 0 0 0 1px #00897B;
  }

  /* Style cho bảng câu hỏi Đúng/Sai - Table Style */
  .group-q-container {
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    overflow: hidden;
    margin-top: 16px;
  }
  .group-q-row {
    display: flex;
    align-items: flex-start;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    background: white;
    gap: 16px;
  }
  .group-q-row:last-child {
    border-bottom: none;
  }
  .group-q-row:hover {
    background: #f8fafc;
  }
  .group-q-label {
    font-weight: 900;
    color: #cbd5e1;
    font-size: 15px;
    width: 20px;
    padding-top: 2px;
  }
  .group-q-content {
    flex: 1;
    font-size: 14px;
    color: #334155;
    font-weight: 600;
    line-height: 1.6;
    text-align: justify;
  }
  .group-q-badge {
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    min-width: 80px;
    text-align: center;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .badge-true {
    background-color: #d1fae5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }
  .badge-false {
    background-color: #ffe4e6;
    color: #be123c;
    border: 1px solid #fecdd3;
  }
  .group-header {
    display: flex;
    justify-content: space-between;
    background-color: #f8fafc;
    padding: 12px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 11px;
    font-weight: 900;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Hiệu ứng rung khi hover */
  @keyframes vibrate-hover {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 1px); }
    40% { transform: translate(-1px, -2px); }
    60% { transform: translate(2px, 0px); }
    80% { transform: translate(1px, -1px); }
    100% { transform: translate(0); }
  }
  
  .card-shake:hover {
      animation: vibrate-hover 0.4s linear infinite;
  }
`;

export const DashboardOverview = ({ 
  students, 
  exams, 
  user, 
  showScoresToStudents = false, 
  onToggleScores 
}: { 
  students: Student[], 
  exams: ExamConfig[], 
  user: UserType | null,
  showScoresToStudents?: boolean,
  onToggleScores?: (val: boolean) => void
}) => {
  const dateStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const stats = useMemo(() => {
    const activeStudentSet = new Set<string>();
    let totalViolations = 0;
    let totalAttempts = 0;
    let totalScoreSum = 0;
    let publishedCount = 0;

    exams.forEach(exam => {
      if (exam.securityCode && exam.securityCode.trim() !== '') {
          publishedCount++;
      }

      if (exam.results && Array.isArray(exam.results)) {
          exam.results.forEach(result => {
            totalAttempts++;
            totalScoreSum += (Number(result.score) || 0);
            totalViolations += (Number(result.violations) || 0);
            
            const emailPart = (result.email || '').trim().toLowerCase();
            const namePart = (result.name || '').trim().toLowerCase();
            const classPart = (result.className || '').trim().toLowerCase();
            
            const identifier = emailPart !== '' ? emailPart : `${namePart}_${classPart}`;
            if (identifier !== '') activeStudentSet.add(identifier);
          });
      }
    });

    const avg = totalAttempts > 0 ? (totalScoreSum / totalAttempts).toFixed(2) : "0.00";

    return { activeCount: activeStudentSet.size, totalViolations, totalAttempts, publishedCount, avg };
  }, [exams]);

  const isTeacher = user?.role === 'teacher';

  const statsRows = [
    [
      { label: 'Tổng số học sinh', value: students.length, badge: 'Hệ thống', icon: Users, color: 'bg-blue-600', textColor: 'text-blue-600' },
      { label: 'Học sinh đã dự thi', value: stats.activeCount, badge: `${stats.totalAttempts} lượt nộp bài`, icon: GraduationCap, color: 'bg-indigo-600', textColor: 'text-indigo-600' },
      { label: 'Lượt vi phạm', value: stats.totalViolations, badge: 'Toàn hệ thống', icon: TriangleAlert, color: 'bg-red-600', textColor: 'text-red-600' },
    ],
    [
      { label: 'Tổng số đề thi', value: exams.length, badge: 'Kho dữ liệu', icon: FileText, color: 'bg-teal-600', textColor: 'text-teal-600' },
      { label: 'Số đề đang mở', value: stats.publishedCount, badge: 'Đang diễn ra', icon: Share2, color: 'bg-purple-600', textColor: 'text-purple-600' },
      { label: 'Điểm TB hệ thống', value: stats.avg, badge: 'Năng lực chung', icon: Trophy, color: 'bg-yellow-600', textColor: 'text-yellow-600' },
    ]
  ];

  return (
    <div className="space-y-12 font-poppins animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {isTeacher ? "Quản trị hệ thống" : "Bảng tin chung"}
          </h2>
          <p className="text-slate-500 mt-1 font-medium">{dateStr}</p>
        </div>
        {!isTeacher && user && (
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black border border-teal-100 uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thí sinh</span>
                <span className="text-sm font-black text-gray-700">{user.name}</span>
              </div>
           </div>
        )}
      </div>

      {isTeacher && (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shrink-0">
                 <Settings className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Cấu hình hiển thị bảng điểm</h3>
                 <p className="text-sm text-slate-400 font-bold">Quyết định việc học sinh có thể truy cập vào tab "Báo cáo điểm" hay không.</p>
              </div>
           </div>
           <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 w-full md:w-auto justify-between md:justify-start">
              <span className={`text-xs font-black uppercase tracking-widest ${showScoresToStudents ? 'text-teal-600' : 'text-slate-400'}`}>
                 {showScoresToStudents ? 'Đang mở bảng điểm' : 'Đang ẩn bảng điểm'}
              </span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={showScoresToStudents} 
                  onChange={(e) => onToggleScores?.(e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
           </div>
        </div>
      )}

      <div className="space-y-10">
        {statsRows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {row.map((stat, sIdx) => (
              <div key={sIdx} className="stat-card-3d">
                <div className="flex flex-col h-full justify-between">
                  <h3 className="text-[15px] font-bold text-gray-800 mb-2 leading-tight">{stat.label}</h3>
                  <p className={`text-5xl font-black my-4 ${stat.textColor} tracking-tighter`}>{stat.value}</p>
                  <div><span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg border border-gray-100 uppercase tracking-widest">{stat.badge}</span></div>
                </div>
                <div className={`stat-icon-box-3d ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="w-9 h-9" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardLayout = ({ 
  children, 
  activeTab, 
  onTabChange, 
  user, 
  isGuest = false, 
  onLoginClick, 
  onLogoutClick 
}: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Quản lý học sinh', icon: Users },
    { id: 'list', label: 'Quản lý đề thi', icon: FileText },
    { id: 'scores', label: 'Báo cáo điểm', icon: BarChart3 },
    { id: 'publish', label: 'Phòng thi', icon: Share2 },
  ];

  return (
    <div className="flex h-screen bg-transparent font-poppins overflow-hidden">
      <style>{DASHBOARD_STYLES}</style>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-64 bg-[#0D9488] border-2 border-gray-100 flex flex-col shadow-2xl m-0 lg:m-4 rounded-r-[20px] lg:rounded-[20px] text-white shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
         <div className="p-6 border-b border-white/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30"><GraduationCap className="w-6 h-6 text-white"/></div>
              <div><h1 className="text-sm font-black text-white uppercase">EXAM ONLINE</h1><p className="text-[10px] text-teal-100 font-bold opacity-80 uppercase tracking-widest">LTT EDU</p></div>
            </div>
            <button className="lg:hidden p-1 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5 text-white" />
            </button>
         </div>
         <div className="flex-1 py-6 px-4 overflow-y-auto">
            <nav className="space-y-2">
               {sidebarItems.map((item) => {
                  if (user?.role === 'student') {
                      const isVisibleForStudent = ['overview', 'publish', 'scores'].includes(item.id);
                      if (!isVisibleForStudent) return null;
                  }

                  const isActive = activeTab === item.id;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => {
                        if (!isGuest) {
                          onTabChange(item.id);
                          setIsSidebarOpen(false); 
                        }
                      }} 
                      disabled={isGuest && item.id !== 'overview'} 
                      className={`sidebar-btn group transition-all duration-300 ${isActive ? 'bg-white text-[#0D9488] font-bold shadow-lg translate-x-2' : 'text-teal-50 hover:bg-white/10'} ${isGuest && item.id !== 'overview' ? 'opacity-30' : ''}`}
                    >
                       <div className="mr-3">{isGuest && item.id !== 'overview' ? <Lock className="w-4 h-4"/> : <item.icon className="w-5 h-5"/>}</div>
                       <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
               })}
            </nav>
         </div>
         <div className="p-4 border-t border-white/20">
             {isGuest ? (
                 <button onClick={onLoginClick} className="w-full flex items-center justify-center gap-2 bg-white text-teal-700 font-bold text-sm p-3 rounded-xl shadow-xl hover:bg-gray-100"><LogIn className="w-4 h-4" /> Đăng nhập</button>
             ) : (
                 <button onClick={onLogoutClick} className="w-full flex items-center gap-3 text-white/90 p-3 hover:bg-white/10 rounded-xl border border-transparent hover:border-white/20 group">
                     <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 uppercase font-black">{user?.name?.charAt(0)}</div>
                     <div className="flex flex-col items-start overflow-hidden"><span className="font-bold text-sm">Đăng xuất</span><span className="text-[11px] text-teal-100 truncate w-full text-left" title={user?.name}>{user?.name}</span></div>
                 </button>
             )}
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
           <header className="bg-[#0D9488] text-white shadow-2xl m-0 lg:m-4 rounded-b-[20px] lg:rounded-[20px] border-b-2 lg:border-2 border-gray-100 shrink-0 relative">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg lg:hidden hover:bg-white/20 transition-colors"
             >
               <Menu className="w-6 h-6 text-white" />
             </button>

             <div className="px-6 py-6 text-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight">Hệ Thống Thi Trắc Nghiệm Online</h1>
                <h3 className="text-xs md:text-sm lg:text-lg mt-1 opacity-90 font-medium">Thầy Lê Văn Đông - Chuyên Lê Thánh Tông</h3>
             </div>
         </header>
         <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-2">{children}</div>
      </div>
    </div>
  );
};

export const ScoreManager = ({ exams, user, showScoresToStudents = false, onRefresh }: { exams: ExamConfig[], user: UserType | null, showScoresToStudents?: boolean, onRefresh?: () => any }) => {
    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<StudentResult[]>([]);
    
    const [viewingResult, setViewingResult] = useState<StudentResult | null>(null);

    useEffect(() => {
        loadExternalLibs();
    }, []);

    useEffect(() => {
        if (!selectedExamId && exams.length > 0) {
            setSelectedExamId(String(exams[0].id));
            if (exams[0].results && exams[0].results.length > 0) {
                setResults(exams[0].results);
            }
        }
    }, [exams, selectedExamId]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!selectedExamId) return;
            const cachedExam = exams.find(e => String(e.id) === String(selectedExamId));
            if (cachedExam && cachedExam.results && cachedExam.results.length > 0) {
                setResults(cachedExam.results);
            }
            setLoading(true);
            try {
                const data = await dataService.getResultsByExamId(selectedExamId);
                if (data && data.length > 0) {
                    setResults(data);
                } else if (!cachedExam || !cachedExam.results || cachedExam.results.length === 0) {
                    setResults([]);
                }
            } catch (err) {
                console.error("Lỗi tải bảng điểm:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [selectedExamId, exams]);

    const isTeacher = user?.role === 'teacher';
    const canSeeScores = isTeacher || showScoresToStudents;

    const currentExam = useMemo(() => exams.find(e => String(e.id) === String(selectedExamId)), [exams, selectedExamId]);

    if (!canSeeScores) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-[40px] shadow-xl border border-gray-100 font-poppins text-center p-10 animate-fade-in">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-100">
                    <EyeOff className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase">Bảng điểm đang ẩn</h2>
                <p className="text-slate-500 font-bold max-w-md">Giáo viên đã tạm khóa chức năng xem điểm chung. Vui lòng quay lại sau khi kỳ thi kết thúc.</p>
            </div>
        );
    }

    const filteredResults = useMemo(() => {
        return results.filter(r => {
            const name = String(r.name || '').toLowerCase();
            const className = String(r.className || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return name.includes(search) || className.includes(search);
        });
    }, [results, searchTerm]);

    const currentExamTitle = currentExam?.title || "Báo cáo kết quả";

    const formatTime = (seconds: number) => {
        const p = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${p}p ${s}s`;
    };

    const handleForceRefresh = async () => {
        setLoading(true);
        try {
            if (onRefresh) await onRefresh();
            if (selectedExamId) {
                const data = await dataService.getResultsByExamId(selectedExamId);
                setResults(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShareLink = () => {
        if (!selectedExamId) return;
        const link = `${window.location.protocol}//${window.location.host}${window.location.pathname}?view=public_scores&examId=${selectedExamId}`;
        copyToClipboard(link);
    };

    return (
        <div className="space-y-10 animate-fade-in font-poppins pb-10 relative">
            {viewingResult && currentExam && (
                <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fade-in">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <button 
                                onClick={() => setViewingResult(null)} 
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-slate-600 transition-all shadow-sm flex items-center gap-2 font-bold"
                            >
                                <ArrowLeft className="w-5 h-5"/> Quay lại bảng điểm
                            </button>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-slate-800">Chi tiết bài làm: {viewingResult.name}</h2>
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Đề thi: {currentExam.title}</p>
                            </div>
                        </div>
                        <ResultScreen 
                            {...viewingResult} 
                            questions={currentExam.questions} 
                            allowReview={true}
                            onRetry={() => setViewingResult(null)} 
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end px-2">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Báo cáo kết quả</h2>
                    <p className="text-base text-slate-400 font-bold mt-2">Bảng xếp hạng và thống kê chi tiết học sinh.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto items-center">
                    <button 
                        onClick={handleForceRefresh}
                        disabled={loading}
                        className={`p-4 bg-white text-slate-600 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50 ${loading ? 'animate-spin opacity-50' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1 md:w-80">
                        <select 
                            className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-12 shadow-sm"
                            value={selectedExamId || ''}
                            onChange={(e) => setSelectedExamId(e.target.value)}
                        >
                            {exams.length > 0 ? exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title.toUpperCase()}</option>) : <option>Chưa có đề thi</option>}
                        </select>
                    </div>
                    {isTeacher && (
                      <>
                        <button 
                            onClick={handleShareLink}
                            className="px-6 py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-black text-sm shadow-sm flex items-center gap-2 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 uppercase tracking-widest whitespace-nowrap"
                            title="Lấy link xem điểm công khai"
                        >
                            <Link className="w-5 h-5" /> Chia sẻ
                        </button>
                        <button 
                            onClick={() => exportResultsToExcel(results, currentExamTitle)}
                            className="px-8 py-4 bg-[#0D9488] text-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 hover:bg-teal-700 transition-all transform hover:-translate-y-1 uppercase tracking-widest whitespace-nowrap"
                        >
                            <FileSpreadsheet className="w-5 h-5" /> Xuất Excel
                        </button>
                      </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden shadow-slate-200/50">
                <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-slate-50/30">
                    <Search className="w-5 h-5 text-slate-300" />
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        placeholder="Lọc theo tên học sinh hoặc lớp..." 
                        className="flex-1 bg-transparent border-none outline-none font-bold text-slate-600 placeholder:text-slate-300"
                    />
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    {loading && results.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest">Đang tải dữ liệu điểm...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-[#f8fafc] text-slate-400 font-black text-[11px] uppercase tracking-[0.1em]">
                                <tr>
                                    <th className="p-3 md:p-6 md:pl-10">Top</th>
                                    <th className="p-3 md:p-6">Họ và tên</th>
                                    <th className="p-3 md:p-6">Lớp</th>
                                    <th className="p-3 md:p-6">Điểm</th>
                                    <th className="p-3 md:p-6 whitespace-nowrap">Đúng/Sai</th>
                                    <th className="p-3 md:p-6 whitespace-nowrap">Thời gian</th>
                                    <th className="p-3 md:p-6 text-center md:pr-10">Xem</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredResults.length > 0 ? (
                                    filteredResults.sort((a,b) => (b.score ?? 0) - (a.score ?? 0)).map((res, idx) => (
                                        <tr key={res.id} className="student-row group hover:bg-slate-50/50 transition-colors">
                                            <td className="p-3 md:p-6 md:pl-10">
                                                <div className={`rank-badge ${idx === 0 ? 'rank-1' : 'rank-default'}`}>{idx + 1}</div>
                                            </td>
                                            <td className="p-3 md:p-6 font-black text-slate-800 text-sm md:text-lg min-w-[120px]">{res.name}</td>
                                            <td className="p-3 md:p-6"><span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg uppercase">{res.className}</span></td>
                                            <td className="p-3 md:p-6"><span className="score-text text-xl md:text-3xl">{(res.score ?? 0).toFixed(2)}</span></td>
                                            <td className="p-3 md:p-6">
                                                <div className="flex items-center gap-2 font-black text-sm md:text-lg whitespace-nowrap">
                                                    <span className="text-green-500">{res.counts?.correct || 0}</span>
                                                    <span className="text-slate-200">/</span>
                                                    <span className="text-red-500">{res.counts?.wrong || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-6 text-slate-400 font-bold text-xs md:text-sm tracking-tight whitespace-nowrap">{formatTime(res.timeSpent || 0)}</td>
                                            <td className="p-3 md:p-6 text-center md:pr-10">
                                                <button 
                                                    onClick={() => {
                                                        if (isTeacher) {
                                                            setViewingResult(res);
                                                        } else {
                                                            alert("Chi tiết bài làm chỉ dành cho giáo viên kiểm tra.");
                                                        }
                                                    }}
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                                                        isTeacher 
                                                        ? 'border-slate-100 text-slate-300 hover:text-teal-600 hover:border-teal-100' 
                                                        : 'border-slate-100 text-slate-200 bg-gray-50/50 cursor-not-allowed'
                                                    }`}
                                                    title={isTeacher ? "Xem chi tiết bài làm" : "Chức năng bị khóa đối với học sinh"}
                                                >
                                                    {isTeacher ? (
                                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                    ) : (
                                                        <div className="relative">
                                                            <Eye className="w-4 h-4 md:w-5 md:h-5 opacity-30" />
                                                            <Lock className="w-2 md:w-2.5 h-2 md:h-2.5 absolute -top-1 -right-1 text-red-400" />
                                                        </div>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-slate-400 font-bold italic">
                                            {loading ? "Đang đồng bộ..." : "Chưa có dữ liệu bài thi cho đề này. Hãy kiểm tra lại sau hoặc nhấn Làm mới."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export const PublicScoreBoard = ({ examId }: { examId: string }) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<StudentResult[]>([]);
    const [examInfo, setExamInfo] = useState<{ title: string, code: string, className: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                // Fetch basic info separately to avoid heavy query if possible, or if getResults fails
                const info = await dataService.getPublicExamInfo(examId);
                setExamInfo(info);

                const data = await dataService.getResultsByExamId(examId);
                setResults(data);
            } catch (err) {
                console.error("Lỗi tải bảng điểm công khai:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [examId]);

    const filteredResults = useMemo(() => {
        return results.filter(r => {
            const name = String(r.name || '').toLowerCase();
            const className = String(r.className || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return name.includes(search) || className.includes(search);
        });
    }, [results, searchTerm]);

    const formatTime = (seconds: number) => {
        const p = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${p}p ${s}s`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-poppins p-4 md:p-8">
            <style>{DASHBOARD_STYLES}</style>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-teal-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-indigo-500"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-teal-50 text-teal-700 text-xs font-black px-3 py-1 rounded-lg border border-teal-100 uppercase tracking-widest">
                                    {examInfo?.code || 'MÃ ĐỀ'}
                                </span>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
                                    LỚP {examInfo?.className || '...'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                {examInfo?.title || 'Đang tải thông tin...'}
                            </h1>
                            <p className="text-slate-400 font-bold mt-1 text-sm">Bảng xếp hạng kết quả thi trực tuyến</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-center">
                                <span className="block text-2xl font-black text-teal-600">{results.length}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lượt nộp bài</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-slate-50/50">
                        <Search className="w-5 h-5 text-slate-300" />
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="Tìm kiếm theo tên học sinh..." 
                            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-600 placeholder:text-slate-300"
                        />
                    </div>
                    
                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-3" />
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Đang cập nhật dữ liệu...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead className="bg-[#f8fafc] text-slate-400 font-black text-[11px] uppercase tracking-[0.1em]">
                                    <tr>
                                        <th className="p-4 pl-8">Hạng</th>
                                        <th className="p-4">Họ và tên</th>
                                        <th className="p-4">Lớp</th>
                                        <th className="p-4">Điểm số</th>
                                        <th className="p-4 whitespace-nowrap">Đúng / Sai</th>
                                        <th className="p-4 text-right pr-8">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((res, idx) => (
                                            <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 pl-8">
                                                    <div className={`rank-badge ${idx === 0 ? 'rank-1' : (idx < 3 ? 'bg-slate-400' : 'bg-slate-200 text-slate-500')}`}>
                                                        {idx + 1}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-slate-700">{res.name}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-md uppercase">{res.className}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-lg font-black ${res.score >= 5 ? 'text-teal-600' : 'text-red-500'}`}>
                                                        {res.score.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 font-bold text-sm">
                                                        <span className="text-green-600">{res.counts?.correct || 0}</span>
                                                        <span className="text-slate-300">/</span>
                                                        <span className="text-red-500">{res.counts?.wrong || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right pr-8 text-slate-400 font-mono text-sm font-bold">
                                                    {formatTime(res.timeSpent || 0)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-10 text-center text-slate-400 font-bold italic">
                                                Chưa có dữ liệu.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ExamList = ({ exams, onSelectExam, onDeleteExam, onResetResults, onPlayExam, onPublish, onUnpublish, onCreate }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');

    const classes = useMemo(() => {
        const uniqueClasses = new Set(exams.map((e: any) => e.className || 'Khác'));
        return Array.from(uniqueClasses).sort();
    }, [exams]);

    const filtered = exams.filter((e: any) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === 'all' || (e.className || 'Khác') === selectedClass;
        return matchesSearch && matchesClass;
    });

    return (
        <div className="space-y-8 animate-fade-in font-poppins pb-10">
            <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black text-slate-800 tracking-tight">Kho Đề Thi</h2>
                   <p className="text-base text-slate-400 font-bold mt-2">Quản lý, chỉnh sửa và tổ chức các kỳ thi.</p>
                </div>
                <button onClick={onCreate} className="px-8 py-4 bg-[#0D9488] text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-100 flex items-center gap-2 hover:bg-teal-700 transition-all transform hover:-translate-y-1 uppercase tracking-widest">
                    <Plus className="w-5 h-5" /> Tạo đề mới
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm đề thi..." 
                        className="flex-1 outline-none font-bold text-gray-600 placeholder-gray-300" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>

                <div className="relative min-w-[200px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Filter className="w-5 h-5" />
                    </div>
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-[24px] outline-none font-bold text-gray-600 appearance-none shadow-sm hover:border-teal-200 transition-all cursor-pointer h-full"
                    >
                        <option value="all">Tất cả các lớp</option>
                        {classes.map((c: any) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((exam: any) => {
                    const isPublished = !!exam.securityCode;
                    return (
                        <div key={exam.id} className="exam-card group">
                           <div className="flex justify-between items-start mb-4">
                               <div className="flex gap-2">
                                   <span className="bg-teal-50 text-teal-700 text-[10px] font-black px-2 py-1 rounded-lg border border-teal-100 uppercase">{exam.code}</span>
                                   <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-lg border border-indigo-100 uppercase">{exam.className}</span>
                               </div>
                               {isPublished && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                           </div>
                           <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 min-h-[56px]" title={exam.title}>{exam.title}</h3>
                           <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                               <span className="flex items-center gap-1"><List className="w-4 h-4"/> {exam.questions?.length || 0} câu</span>
                               <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {exam.duration}p</span>
                               <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {exam.results?.length || 0}</span>
                           </div>
                           
                           <div className="mt-auto grid grid-cols-4 gap-2 border-t border-gray-50 pt-4">
                                <button onClick={() => onPlayExam(exam)} className="col-span-1 p-2 bg-gray-50 hover:bg-teal-50 text-gray-400 hover:text-teal-600 rounded-xl transition-colors flex flex-col items-center justify-center gap-1" title="Thi thử"><PlayCircle className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Thi</span></button>
                                <button onClick={() => onSelectExam(exam)} className="col-span-1 p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition-colors flex flex-col items-center justify-center gap-1" title="Chỉnh sửa"><Edit className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Sửa</span></button>
                                {isPublished ? (
                                    <button onClick={() => onUnpublish(exam)} className="col-span-1 p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors flex flex-col items-center justify-center gap-1" title="Dừng thi"><LogOut className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Dừng</span></button>
                                ) : (
                                    <button onClick={() => onPublish(exam)} className="col-span-1 p-2 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-xl transition-colors flex flex-col items-center justify-center gap-1" title="Tổ chức thi"><Share2 className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Mở</span></button>
                                )}
                                <button onClick={() => onDeleteExam(exam.id)} className="col-span-1 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors flex flex-col items-center justify-center gap-1" title="Xóa đề"><Trash2 className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Xóa</span></button>
                           </div>
                           <div className="mt-3 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
                                <button onClick={() => exportExamToDocx(exam)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-600 transition-colors uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                                    <Download className="w-3.5 h-3.5"/> Tải đề gốc
                                </button>
                                <button onClick={() => onResetResults(exam.id)} className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50">
                                    <RotateCcw className="w-3.5 h-3.5"/> Reset KQ
                                </button>
                           </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const PublishView = ({ exams, onPlayExam, user }: { exams: ExamConfig[], onPlayExam: (e: ExamConfig) => void, user: UserType | null }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [now, setNow] = useState(new Date());

    // Cập nhật thời gian thực mỗi giây để tự động mở đề
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    
    const publishedExams = useMemo(() => {
        return exams.filter(e => !!e.securityCode && e.securityCode.trim() !== '');
    }, [exams]);

    const filtered = publishedExams.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getExamStatus = (exam: ExamConfig) => {
        const start = exam.startTime ? new Date(exam.startTime) : null;
        const end = exam.endTime ? new Date(exam.endTime) : null;
        
        if (start && now < start) return 'UPCOMING';
        if (end && now > end) return 'ENDED';
        return 'HAPPENING';
    };

    const formatCountdown = (targetDate: Date) => {
        const diff = targetDate.getTime() - now.getTime();
        if (diff <= 0) return "00:00:00";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="space-y-8 animate-fade-in font-poppins pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                   <h2 className="text-4xl font-black text-slate-800 tracking-tight">Phòng Thi Trực Tuyến</h2>
                   <p className="text-base text-slate-400 font-bold mt-2">Danh sách các kỳ thi đang diễn ra.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Tìm kiếm theo tên đề hoặc lớp..." className="flex-1 outline-none font-bold text-gray-600 placeholder-gray-300" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(exam => {
                    const status = getExamStatus(exam);
                    const isUpcoming = status === 'UPCOMING';
                    const isEnded = status === 'ENDED';
                    const isHappening = status === 'HAPPENING';
                    
                    return (
                        <div key={exam.id} className={`exam-card group relative overflow-hidden transition-all ${isEnded ? 'bg-gray-50 opacity-80' : 'bg-white hover:bg-[#f0fdfa]'}`}>
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${isUpcoming ? 'bg-amber-400' : (isEnded ? 'bg-gray-300' : 'bg-gradient-to-r from-teal-400 to-emerald-500')}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pt-2">
                               <div className="flex gap-2">
                                   <span className="bg-teal-50 text-teal-700 text-[10px] font-black px-3 py-1 rounded-lg border border-teal-100 uppercase tracking-wide">
                                       Mã đề: {exam.code}
                                   </span>
                                   <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-wide">
                                       Lớp: {exam.className}
                                   </span>
                               </div>
                               {isUpcoming && (
                                   <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest animate-pulse">
                                       <Hourglass className="w-3 h-3" /> Sắp mở
                                   </span>
                               )}
                               {isEnded && (
                                   <span className="text-[10px] font-black bg-gray-200 text-gray-500 px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest">
                                       <XCircle className="w-3 h-3" /> Kết thúc
                                   </span>
                               )}
                               {isHappening && (
                                   <div className="live-badge-red">
                                       <div className="live-dot-red"></div> LIVE
                                   </div>
                               )}
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 min-h-[56px]" title={exam.title}>{exam.title}</h3>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                                <span className="flex items-center gap-1.5"><List className="w-4 h-4 text-teal-500"/> {exam.questions?.length || 0} câu</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal-500"/> {exam.duration} phút</span>
                            </div>

                            {isUpcoming && exam.startTime && (
                                <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Tự động mở sau</p>
                                    <p className="text-2xl font-black text-amber-600 font-mono tracking-tight">
                                        {formatCountdown(new Date(exam.startTime))}
                                    </p>
                                </div>
                            )}

                            {exam.startTime && exam.endTime && !isUpcoming && (
                                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Thời gian mở đề</div>
                                    <p className="text-xs font-bold text-slate-600">
                                        {formatDateTimeVN(exam.startTime)}
                                        <span className="mx-1 text-slate-400">➜</span>
                                        {formatDateTimeVN(exam.endTime)}
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => !isUpcoming && !isEnded && onPlayExam(exam)}
                                disabled={isUpcoming || isEnded}
                                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform uppercase tracking-widest
                                    ${isUpcoming 
                                        ? 'bg-amber-100 text-amber-400 cursor-not-allowed shadow-none' 
                                        : (isEnded 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                                            : 'bg-[#0D9488] text-white shadow-teal-100 hover:bg-teal-700 hover:-translate-y-1 group-hover:shadow-2xl'
                                        )
                                    }
                                `}
                            >
                                {isUpcoming ? <Timer className="w-5 h-5"/> : (isEnded ? <XCircle className="w-5 h-5"/> : <PlayCircle className="w-5 h-5"/>)}
                                {isUpcoming ? 'Đang chờ mở đề' : (isEnded ? 'Đã đóng đề' : 'Vào thi ngay')}
                            </button>
                        </div>
                    );
                })}
                
                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60">
                        <div className="bg-gray-100 p-6 rounded-full mb-4"><Search className="w-10 h-10 text-gray-400"/></div>
                        <p className="text-xl font-bold text-gray-400">Không tìm thấy đề thi nào phù hợp.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const StudentManager = ({ students, onAddStudent, onEditStudent, onDeleteStudent, onImportStudents, onApproveStudent }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const filtered = students.filter((s: Student) => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in font-poppins pb-10">
            {showAddModal && <StudentModal onClose={() => setShowAddModal(false)} onSave={onAddStudent} />}
            {editingStudent && <StudentModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={onEditStudent} />}
            {showImportModal && <ImportStudentModal onClose={() => setShowImportModal(false)} onImport={onImportStudents} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                   <h2 className="text-4xl font-black text-slate-800 tracking-tight">Quản lý Học sinh</h2>
                   <p className="text-base text-slate-400 font-bold mt-2">Danh sách tài khoản học sinh trong hệ thống.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowImportModal(true)} className="px-6 py-4 bg-white text-teal-700 border border-teal-100 rounded-2xl font-black text-sm shadow-sm flex items-center gap-2 hover:bg-teal-50 transition-all uppercase tracking-widest">
                        <FileSpreadsheet className="w-5 h-5" /> Import Excel
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-[#0D9488] text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-100 flex items-center gap-2 hover:bg-teal-700 transition-all transform hover:-translate-y-1 uppercase tracking-widest">
                        <UserPlus className="w-5 h-5" /> Thêm học sinh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-slate-50/50">
                    <Search className="w-5 h-5 text-slate-300" />
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        placeholder="Tìm kiếm học sinh..." 
                        className="flex-1 bg-transparent border-none outline-none font-bold text-slate-600 placeholder:text-slate-300"
                    />
                </div>
                
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#f8fafc] text-slate-400 font-black text-[11px] uppercase tracking-[0.1em] sticky top-0 z-10">
                            <tr>
                                <th className="p-4 pl-8">STT</th>
                                <th className="p-4">Họ và tên</th>
                                <th className="p-4">Lớp</th>
                                <th className="p-4">Email / Tài khoản</th>
                                <th className="p-4 text-center">Trạng thái</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filtered.map((s: Student, idx: number) => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-8 font-bold text-slate-400 text-sm">{idx + 1}</td>
                                    <td className="p-4 font-bold text-slate-700">{s.name}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-md uppercase">{s.className}</span></td>
                                    <td className="p-4 font-medium text-slate-500 text-sm">{s.email || '---'}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => onApproveStudent(s.email, s.id, !s.isApproved)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${s.isApproved ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500' : 'bg-yellow-100 text-yellow-600 hover:bg-green-100 hover:text-green-600'}`}
                                        >
                                            {s.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingStudent(s)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                                            <button onClick={() => onDeleteStudent(s.id, s.email)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const ExamEditor = ({ exam, onUpdate, onBack, onPublish, initialShowImport }: any) => {
    const [showEditModal, setShowEditModal] = useState<Question | null>(null);
    const [showImportModal, setShowImportModal] = useState(initialShowImport || false);
    const [questions, setQuestions] = useState<Question[]>(exam.questions || []);

    const handleUpdateQuestions = (newQs: Question[]) => { setQuestions(newQs); onUpdate({ ...exam, questions: newQs }); };
    
    // Tạo danh sách các phần (sections) theo thứ tự xuất hiện đầu tiên của chúng
    const sectionOrder: string[] = [];
    questions.forEach(q => {
      const sec = q.section || "KHÁC";
      if (!sectionOrder.includes(sec)) sectionOrder.push(sec);
    });

    const handleAddQuestion = (type: QuestionType) => {
        const newQ: Question = {
            id: Date.now() + Math.random(),
            type,
            question: "Nội dung câu hỏi mới...",
            section: type === 'choice' ? "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN" : (type === 'group' ? "PHẦN II. CÂU HỎI ĐÚNG SAI" : "PHẦN III. TRẢ LỜI NGẮN"),
            options: type === 'choice' ? ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"] : [],
            subQuestions: type === 'group' ? [{ id: '1', content: "Mệnh đề a...", correctAnswer: true }, { id: '2', content: "Mệnh đề b...", correctAnswer: false },{ id: '3', content: "Mệnh đề c...", correctAnswer: true },{ id: '4', content: "Mệnh đề d...", correctAnswer: true }] : [],
            answer: type === 'choice' ? "Lựa chọn 1" : "",
            mixQuestion: true,
            mixOptions: true
        };
        handleUpdateQuestions([...questions, newQ]);
    };

    return (
        <div className="flex flex-col h-full bg-[#f1f8f7] font-poppins">
            <style>{DASHBOARD_STYLES}</style>
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 hover:bg-slate-50 rounded-xl border text-slate-400 hover:text-indigo-600 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 truncate max-w-md">{exam.title}</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{questions.length} câu hỏi hệ thống</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowImportModal(true)} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 border border-indigo-100 transition-all"><FileUp className="w-4 h-4"/> Import Word</button>
                    <button onClick={onPublish} className="px-6 py-2.5 bg-[#0D9488] text-white rounded-xl font-black shadow-lg hover:bg-teal-700 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"><Share2 className="w-4 h-4"/> Xuất bản đề</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 max-w-5xl mx-auto w-full pb-32">
                {questions.length === 0 && (
                   <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-gray-200">
                      <BookOpen className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold">Chưa có câu hỏi nào. Nhấn các nút bên dưới để thêm hoặc Import Word.</p>
                   </div>
                )}
                
                {sectionOrder.map(section => {
                  const qs = questions.filter(q => (q.section || "KHÁC") === section);
                  return (
                    <div key={section} className="space-y-6">
                      <div className="flex justify-center mb-8">
                         <span className="section-pill">{section}</span>
                      </div>
                      
                      {qs.map((q) => (
                        <div key={q.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group p-8 relative">
                            <div className="flex justify-between items-start mb-6">
                               <div className="question-badge">Câu {questions.indexOf(q) + 1}</div>
                               <div className="flex gap-2">
                                  <button onClick={() => setShowEditModal(q)} className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">Sửa</button>
                                  <button onClick={() => handleUpdateQuestions(questions.filter(item => item.id !== q.id))} className="px-4 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Xóa</button>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <div className="text-[15px] font-medium text-slate-700 leading-relaxed text-justify">
                                  <MathRenderer text={q.question} allowMarkdown={true} />
                               </div>
                               
                               {q.image && (
                                  <div className="max-w-xl mx-auto py-2">
                                    <img src={q.image} alt="Question" className="max-h-[300px] rounded-2xl shadow-sm border object-contain mx-auto" />
                                  </div>
                               )}

                               {q.type === 'choice' && (
                                  <div className="choice-grid mt-6">
                                     {q.options?.map((opt, i) => (
                                       <div key={i} className={`choice-item-box ${q.answer === opt ? 'correct' : ''} flex-col !items-start !gap-2`}>
                                          <div className="flex items-center gap-2 w-full">
                                            <span className={`${q.answer === opt ? 'text-green-600' : 'text-slate-400'} font-black w-6`}>{String.fromCharCode(65+i)}.</span>
                                            <div className="flex-1"><MathRenderer text={opt} allowMarkdown={true} /></div>
                                          </div>
                                          {q.optionImages?.[i] && (
                                            <div className="ml-8">
                                              <img src={q.optionImages[i]} alt="Option" className="w-24 h-24 rounded object-cover border" />
                                            </div>
                                          )}
                                       </div>
                                     ))}
                                  </div>
                               )}

                               {q.type === 'group' && (
                                  <div className="border border-slate-100 rounded-2xl overflow-hidden mt-6">
                                     <div className="bg-slate-50/50 p-3 flex text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                                        <div className="flex-1 px-4">Nội dung mệnh đề</div>
                                        <div className="w-20 text-center">Đáp án</div>
                                     </div>
                                     {q.subQuestions?.map((sub, i) => (
                                        <div key={i} className="flex items-center p-4 border-b last:border-b-0">
                                           <div className="flex-1 text-sm font-medium text-slate-600 flex items-start gap-2">
                                              <span className="text-slate-300 font-bold">{String.fromCharCode(97+i)})</span>
                                              <MathRenderer text={sub.content} allowMarkdown={true} />
                                           </div>
                                           <div className="w-20 text-center">
                                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${sub.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {sub.correctAnswer ? 'Đúng' : 'Sai'}
                                              </span>
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               )}

                               {q.type === 'text' && (
                                  <div className="mt-4 p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl">
                                     <div className="flex items-center gap-2 mb-2">
                                        <Key className="w-4 h-4 text-indigo-500" />
                                        <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Đáp án gợi ý:</span>
                                     </div>
                                     <p className="text-sm font-medium text-slate-600">{q.answer || "(Chưa thiết lập)"}</p>
                                  </div>
                               )}
                            </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 bg-white/80 backdrop-blur-md p-3 rounded-[30px] shadow-2xl border border-white/50 z-50">
                <button onClick={() => handleAddQuestion('choice')} className="px-6 py-3.5 bg-[#0D9488] text-white rounded-[20px] font-black text-xs hover:bg-teal-700 shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-1 uppercase tracking-wider"><Plus className="w-4 h-4" /> Trắc nghiệm</button>
                <button onClick={() => handleAddQuestion('group')} className="px-6 py-3.5 bg-indigo-600 text-white rounded-[20px] font-black text-xs hover:bg-indigo-700 shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-1 uppercase tracking-wider"><Plus className="w-4 h-4" /> Đúng/Sai</button>
                <button onClick={() => handleAddQuestion('text')} className="px-6 py-3.5 bg-slate-800 text-white rounded-[20px] font-black text-xs hover:bg-slate-900 shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-1 uppercase tracking-wider"><Plus className="w-4 h-4" /> Trả lời ngắn</button>
            </div>
            
            {showEditModal && <EditQuestionModal question={showEditModal} onSave={(updatedQ) => { handleUpdateQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q)); setShowEditModal(null); }} onClose={() => setShowEditModal(null)} />}
            {showImportModal && <ImportModal onImport={(qs) => { handleUpdateQuestions([...questions, ...qs]); setShowImportModal(false); }} onClose={() => setShowImportModal(false)} />}
        </div>
    );
};