'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/api';
import { Course } from '../../lib/types';

export default function TestCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Testing API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/courses`);

      const response = await apiClient.getCourses();

      console.log('API Response:', response);

      if (response.success && response.data) {
        setCourses(response.data);
      } else {
        setError(response.error || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Test với raw fetch để debug
  const testRawFetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = 'http://localhost:5000/api/v1/courses';
      console.log('Testing raw fetch to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', response.headers);

      const data = await response.json();
      console.log('Raw response data:', data);

      if (response.ok) {
        setCourses(data.data || data);
      } else {
        setError(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Raw fetch error:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Courses API</h1>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testGetCourses}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test API Client'}
          </button>

          <button
            onClick={testRawFetch}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Raw Fetch'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {courses && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Courses ({Array.isArray(courses) ? courses.length : 0}):</h2>

            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(courses, null, 2)}
              </pre>
            </div>

            {Array.isArray(courses) && courses.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: Course, index: number) => (
                  <div key={course.id || index} className="p-4 border rounded shadow">
                    <h3 className="font-bold text-lg">{course.title || 'No title'}</h3>
                    <p className="text-gray-600 text-sm mt-2">{course.description || 'No description'}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><strong>Instructor:</strong> {course.instructor || 'N/A'}</p>
                      <p><strong>Price:</strong> ${course.price || 0}</p>
                      <p><strong>Level:</strong> {course.level || 'N/A'}</p>
                      <p><strong>Category:</strong> {course.category || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-800">Debug Info:</h3>
          <p className="text-sm text-blue-600">API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}</p>
          <p className="text-sm text-blue-600">Full URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/courses</p>
        </div>
      </div>
    </div>
  );
}