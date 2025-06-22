"use client";

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { CoursesPage } from './components/CoursesPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { ExpertsPage } from './components/ExpertsPage';
import { ExpertDetailPage } from './components/ExpertDetailPage';
import { ProfilePage } from './components/ProfilePage';
import { ForumPage } from './components/ForumPage';
import { BlogPage } from './components/BlogPage';
import { AuthPage } from './components/AuthPage';
import { ScheduleManagementPage } from './components/ScheduleManagementPage';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './components/ui/dialog';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState('profile'); // Default profile tab
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'expert';
  }

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
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

  const handlePurchase = (courseId: string) => {
    // Check if user is logged in
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }

    // Simulate purchase process
    console.log('Purchasing course:', courseId);
    // Here you would typically integrate with payment system
    // For now, just show a success message or redirect
  };

  const handleProfileTabChange = (tab: string) => {
    setProfileTab(tab);
  };

  const handleAuthSuccess = (user: { id: string; name: string; email: string; avatar: string; role: string }) => {
    const mappedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'user' | 'expert', // Ensure role matches the User interface
    };
    setCurrentUser(mappedUser);
    setShowAuthDialog(false);
    console.log('User authenticated:', mappedUser);
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

  const handlePageChange = (page: string) => {
    // Check if protected pages require authentication
    const protectedPages = ['profile', 'schedule-management'];

    if (protectedPages.includes(page) && !currentUser) {
      setShowAuthDialog(true);
      return;
    }

    // Check if schedule management requires expert role
    if (page === 'schedule-management' && currentUser?.role !== 'expert') {
      // Redirect non-experts to profile page with a message
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
                handleCourseSelect(courseId);
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

  // Override navigation for detail pages
  const getNavigationPage = () => {
    if (currentPage === 'course-detail') {
      return 'courses';
    }
    if (currentPage === 'expert-detail') {
      return 'experts';
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

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-none max-h-none w-screen h-screen p-0 bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">
            Đăng nhập hoặc đăng ký tài khoản
          </DialogTitle>
          <DialogDescription className="sr-only">
            Dialog đăng nhập và đăng ký tài khoản. Người dùng có thể đăng nhập bằng email/password hoặc qua Google/Facebook.
          </DialogDescription>
          <AuthPage
            onClose={handleCloseAuth}
            onAuthSuccess={handleAuthSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
