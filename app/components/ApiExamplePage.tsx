'use client';

import React, { useState } from 'react';
import { useAuthContext } from '../../lib/auth-context';
import { useCourses, useExperts, useBlogPosts } from '../../lib/hooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ApiExamplePage() {
    const { isAuthenticated, user, login, logout } = useAuthContext();
    const { data: courses, loading: coursesLoading, error: coursesError } = useCourses();
    const { data: experts, loading: expertsLoading, error: expertsError } = useExperts();
    const { data: blogPosts, loading: blogLoading, error: blogError } = useBlogPosts();

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(loginForm);
            if (result.success) {
                console.log('Login successful!');
            } else {
                console.error('Login failed:', result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">API Integration Example</h1>

            {/* Authentication Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <p>Welcome, {user?.name || user?.email}!</p>
                            <p>Role: {user?.role}</p>
                            <Button onClick={logout} variant="outline">
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={loginForm.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setLoginForm({ ...loginForm, email: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={loginForm.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setLoginForm({ ...loginForm, password: e.target.value })
                                }
                                required
                            />
                            <Button type="submit">Login</Button>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Courses Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    {coursesLoading && <p>Loading courses...</p>}
                    {coursesError && <p className="text-red-500">Error: {coursesError}</p>}
                    {courses && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Card key={course.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                                        <p className="text-sm">Instructor: {course.instructor}</p>
                                        <p className="text-sm">Price: ${course.price}</p>
                                        <p className="text-sm">Level: {course.level}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Experts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Experts</CardTitle>
                </CardHeader>
                <CardContent>
                    {expertsLoading && <p>Loading experts...</p>}
                    {expertsError && <p className="text-red-500">Error: {expertsError}</p>}
                    {experts && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {experts.map((expert) => (
                                <Card key={expert.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{expert.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-2">{expert.bio}</p>
                                        <p className="text-sm">Expertise: {expert.expertise.join(', ')}</p>
                                        <p className="text-sm">Rating: {expert.rating}/5</p>
                                        <p className="text-sm">Rate: ${expert.hourlyRate}/hour</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Blog Posts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    {blogLoading && <p>Loading blog posts...</p>}
                    {blogError && <p className="text-red-500">Error: {blogError}</p>}
                    {blogPosts && (
                        <div className="space-y-4">
                            {blogPosts.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {post.content.substring(0, 200)}...
                                        </p>
                                        <p className="text-sm">Author: {post.author}</p>
                                        <p className="text-sm">Category: {post.category}</p>
                                        <p className="text-sm">
                                            Tags: {post.tags.join(', ')}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}