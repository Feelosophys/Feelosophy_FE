"use client"

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { CoursesPage } from './components/CoursesPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { CourseLearnPage } from './components/CourseLearnPage';
import { CorporatePurchasePage } from './components/CorporatePurchasePage';
import { ExpertsPage } from './components/ExpertsPage';
import { ExpertDetailPage } from './components/ExpertDetailPage';
import { ProfilePage } from './components/ProfilePage';
import { ForumPage } from './components/ForumPage';
import { BlogPage } from './components/BlogPage';
import { AuthPage } from './components/AuthPage';
import { ScheduleManagementPage } from './components/ScheduleManagementPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminUsersPage } from './components/AdminUsersPage';
import { AdminCoursesPage } from './components/AdminCoursesPage';
import { AdminCourseReviewPage } from './components/AdminCourseReviewPage';
import { AdminCreatorReviewPage } from './components/AdminCreatorReviewPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CreateCoursePage } from './components/CreateCoursePage';
import { BecomeCreatorPage } from './components/BecomeCreatorPage';
import { OrganizationPage } from './components/OrganizationPage';
import { Dialog, DialogContent, DialogTitle } from './components/ui/dialog';
import { VisuallyHidden } from './components/ui/visually-hidden';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState('profile');
  interface User {
    role: 'admin' | 'teacher' | 'expert' | 'student';
    [key: string]: unknown; // Add other properties as needed
  }

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  };

  const handleCourseLearn = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-learn');
  };

  const handleExpertSelect = (expertId: string) => {
    setSelectedExpertId(expertId);
    setCurrentPage('expert-detail');
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentPage('courses');
  };

  const handleBackToExperts = () => {
    setSelectedExpertId(null);
    setCurrentPage('experts');
  };

  const handleBackToTeacherDashboard = () => {
    setCurrentPage('teacher-dashboard');
  };

  const handlePurchase = (courseId: string) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }
    console.log('Purchasing course:', courseId);
  };

  const handleCorporatePurchase = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('corporate-purchase');
  };

  const handleBackToCourseDetail = () => {
    if (selectedCourseId) {
      setCurrentPage('course-detail');
    } else {
      setCurrentPage('courses');
    }
  };

  const handleProfileTabChange = (tab: string) => {
    setProfileTab(tab);
  };

  const handleAuthSuccess = (user: unknown) => {
    setCurrentUser(user as User);
    setShowAuthDialog(false);
    console.log('User authenticated:', user);
    
    if (typeof user === 'object' && user !== null && 'role' in user && user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (typeof user === 'object' && user !== null && 'role' in user && user.role === 'teacher') {
      setCurrentPage('teacher-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    console.log('User logged out');
  };

  const handleShowAuth = () => {
    setShowAuthDialog(true);
  };

  const handleCloseAuth = () => {
    setShowAuthDialog(false);
  };

  const handleCreateCourse = () => {
    setCurrentPage('create-course');
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('edit-course');
  };

  const handleSaveCourse = (courseData: unknown) => {
    console.log('Saving course:', courseData);
    setCurrentPage('teacher-dashboard');
  };

  const handlePageChange = (page: string) => {
    const protectedPages = ['profile', 'schedule-management', 'admin-dashboard', 'admin-users', 'admin-courses', 'admin-analytics', 'admin-course-review', 'admin-creator-review', 'teacher-dashboard', 'create-course', 'course-learn', 'become-creator', 'organization'];
    
    if (protectedPages.includes(page) && !currentUser) {
      setShowAuthDialog(true);
      return;
    }

    const adminPages = ['admin-dashboard', 'admin-users', 'admin-courses', 'admin-analytics', 'admin-course-review', 'admin-creator-review'];
    if (adminPages.includes(page) && currentUser?.role !== 'admin') {
      setCurrentPage('home');
      return;
    }

    const teacherPages = ['teacher-dashboard', 'create-course'];
    if (teacherPages.includes(page) && currentUser?.role !== 'teacher') {
      setCurrentPage('home');
      return;
    }

    if (page === 'schedule-management' && currentUser?.role !== 'expert') {
      setCurrentPage('profile');
      return;
    }
    
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={handlePageChange} />;
      case 'courses':
        return <CoursesPage onCourseSelect={handleCourseSelect} />;
      case 'course-detail':
        return selectedCourseId ? (
          <CourseDetailPage 
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
            onPurchase={handlePurchase}
            onCorporatePurchase={handleCorporatePurchase}
            onLearn={handleCourseLearn}
          />
        ) : <CoursesPage onCourseSelect={handleCourseSelect} />;
      case 'course-learn':
        return selectedCourseId ? (
          <CourseLearnPage 
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
          />
        ) : <CoursesPage onCourseSelect={handleCourseSelect} />;
      case 'corporate-purchase':
        return selectedCourseId ? (
          <CorporatePurchasePage
            courseId={selectedCourseId}
            onBack={handleBackToCourseDetail}
          />
        ) : <CoursesPage onCourseSelect={handleCourseSelect} />;
      case 'experts':
        return <ExpertsPage onExpertSelect={handleExpertSelect} />;
      case 'expert-detail':
        return selectedExpertId ? (
          <ExpertDetailPage 
            expertId={selectedExpertId}
            onBack={handleBackToExperts}
            currentUser={currentUser || undefined}
            onShowAuth={handleShowAuth}
          />
        ) : <ExpertsPage onExpertSelect={handleExpertSelect} />;
      case 'forum':
        return <ForumPage />;
      case 'blog':
        return <BlogPage />;
      case 'schedule-management':
        return currentUser?.role === 'expert' ? (
          <ScheduleManagementPage />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'teacher-dashboard':
        return currentUser?.role === 'teacher' ? (
          <TeacherDashboard 
            onCreateCourse={handleCreateCourse}
            onEditCourse={handleEditCourse}
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'create-course':
        return currentUser?.role === 'teacher' ? (
          <CreateCoursePage 
            onBack={handleBackToTeacherDashboard}
            onSave={handleSaveCourse}
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'edit-course':
        return currentUser?.role === 'teacher' && selectedCourseId ? (
          <CreateCoursePage 
            onBack={handleBackToTeacherDashboard}
            onSave={handleSaveCourse}
            existingCourse={{ id: selectedCourseId }}
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-dashboard':
        return currentUser?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-users':
        return currentUser?.role === 'admin' ? (
          <AdminUsersPage />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-courses':
        return currentUser?.role === 'admin' ? (
          <AdminCoursesPage />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-course-review':
        return currentUser?.role === 'admin' ? (
          <AdminCourseReviewPage />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-creator-review':
        return currentUser?.role === 'admin' ? (
          <AdminCreatorReviewPage />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'admin-analytics':
        return currentUser?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'become-creator':
        return currentUser ? (
          <BecomeCreatorPage 
            onBack={() => setCurrentPage('profile')}
            currentUser={currentUser || undefined}
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'organization':
        return currentUser ? (
          <OrganizationPage 
            onBack={() => setCurrentPage('profile')}
            currentUser={currentUser || undefined}
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      case 'profile':
        return currentUser ? (
          <ProfilePage 
            defaultTab={profileTab}
            onCourseSelect={(courseId) => {
              if (courseId === 'courses') {
                setCurrentPage('courses');
              } else if (courseId === 'experts') {
                setCurrentPage('experts');
              } else {
                handleCourseLearn(courseId);
              }
            }} 
          />
        ) : (
          <LandingPage onNavigate={handlePageChange} />
        );
      default:
        return <LandingPage onNavigate={handlePageChange} />;
    }
  };

  const getNavigationPage = () => {
    if (currentPage === 'course-detail' || currentPage === 'course-learn') {
      return 'courses';
    }
    if (currentPage === 'expert-detail') {
      return 'experts';
    }
    if (currentPage === 'corporate-purchase') {
      return 'courses';
    }
    if (currentPage === 'create-course' || currentPage === 'edit-course') {
      return 'teacher-dashboard';
    }
    return currentPage;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={getNavigationPage()} 
        onPageChange={handlePageChange}
        onProfileTabChange={handleProfileTabChange}
        currentUser={currentUser || undefined}
        onShowAuth={handleShowAuth}
        onLogout={handleLogout}
      />
      <main>
        {renderPage()}
      </main>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent 
          className="max-w-none max-h-none w-screen h-screen p-0 bg-transparent border-none shadow-none"
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>
              Đăng nhập hoặc đăng ký tài khoản
            </DialogTitle>
          </VisuallyHidden>
          <AuthPage 
            onClose={handleCloseAuth}
            onAuthSuccess={handleAuthSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}