import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/actionCenter";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

export function StudentsDirectory() {
  const { data: students, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const [searchText, setSearchText] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    searchText: "",
    gradeFilter: "all",
    riskFilter: "all",
    statusFilter: "all",
  });

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load students."}
        onRetry={() => refetch()}
      />
    );
  }

  if (!students) return null;

  const gradeOptions = useMemo(() => {
    const grades = Array.from(new Set(students.map((student) => student.grade)));
    return grades.sort((a, b) => a - b);
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const searchValue = appliedFilters.searchText.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      student.name.toLowerCase().includes(searchValue) ||
      student.id.toLowerCase().includes(searchValue) ||
      student.counselorId.toLowerCase().includes(searchValue);

    const matchesGrade =
      appliedFilters.gradeFilter === "all" ||
      String(student.grade) === appliedFilters.gradeFilter;

    const matchesRisk =
      appliedFilters.riskFilter === "all" ||
      (appliedFilters.riskFilter === "at_risk" && student.enrollmentStatus === "at_risk") ||
      (appliedFilters.riskFilter === "on_track" && student.enrollmentStatus !== "at_risk");

    const matchesStatus =
      appliedFilters.statusFilter === "all" ||
      student.enrollmentStatus === appliedFilters.statusFilter;

    return matchesSearch && matchesGrade && matchesRisk && matchesStatus;
  });

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  const getAvatarGradient = (id: string) => {
    switch (id) {
      case "stu_001":
        return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"; // Maya Patel (Indigo-Purple)
      case "stu_002":
        return "linear-gradient(135deg, #0d9488 0%, #10b981 100%)"; // Jordan Lee (Teal-Green)
      case "stu_003":
        return "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"; // Carlos Rivera (Amber-Red)
      default:
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
    }
  };

  const getRiskStatusBadge = (status: string) => {
    if (status === "at_risk") {
      return (
        <span className="risk-badge risk-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'inline-block'
          }}></span>
          AT RISK
        </span>
      );
    }
    return (
      <span className="risk-badge risk-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#10b981',
          display: 'inline-block'
        }}></span>
        ON TRACK
      </span>
    );
  };

  return (
    <div className="tab-container students-directory">
      <div className="tab-header">
        <div className="header-text">
          <h2 className="tab-title">Students Directory</h2>
          <p className="tab-subtitle">Managing {students.length} active student records</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge stat-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div className="stat-info">
              <span className="stat-label">AT RISK</span>
              <span className="stat-value">{students.filter(s => s.enrollmentStatus === 'at_risk').length}</span>
            </div>
          </div>
          <div className="stat-badge stat-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <div className="stat-info">
              <span className="stat-label">ON TRACK</span>
              <span className="stat-value">{students.filter(s => s.enrollmentStatus !== 'at_risk').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="21" x2="16.65" y2="16.65"></line><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <input
            type="text"
            placeholder="Search by name, ID or advisor..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        <div className="filter-dropdowns">
          <div className="dropdown">
            <span className="dropdown-label">GRADE:</span>
            <select
              value={gradeFilter}
              onChange={(event) => setGradeFilter(event.target.value)}
            >
              <option value="all">All Grades</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={String(grade)}>
                  {grade}th
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown">
            <span className="dropdown-label">RISK LEVEL:</span>
            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="at_risk">At Risk</option>
              <option value="on_track">On Track</option>
            </select>
          </div>
          <div className="dropdown">
            <span className="dropdown-label">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="at_risk">At Risk</option>
            </select>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            setAppliedFilters({
              searchText,
              gradeFilter,
              riskFilter,
              statusFilter,
            })
          }
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          Apply Filters
        </button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>STUDENT NAME</th>
            <th>GRADE</th>
            <th>GPA PROGRESS</th>
            <th>RISK STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} style={{ transition: 'background-color 0.2s ease' }}>
              <td>
                <div className="student-cell">
                  <div 
                    className="student-avatar-initials"
                    style={{
                      background: getAvatarGradient(student.id),
                      color: '#ffffff',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <div className="student-name">{student.name}</div>
                    <div className="student-id">ID: #{student.id.replace('stu_', '')}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="grade-badge" style={{
                  padding: '4px 8px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  border: '1px solid #e5e7eb'
                }}>{student.grade}th Grade</span>
              </td>
              <td>
                <div className="gpa-cell">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`gpa-value ${student.gpa < 3 ? 'gpa-low' : 'gpa-high'}`} style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {student.gpa.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/ 4.0</span>
                  </div>
                  <div style={{
                    width: '130px',
                    height: '6px',
                    background: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '6px'
                  }}>
                    <div style={{
                      width: `${(student.gpa / 4.0) * 100}%`,
                      height: '100%',
                      background: student.gpa < 3.0 ? '#ef4444' : '#10b981',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              </td>
              <td>{getRiskStatusBadge(student.enrollmentStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
