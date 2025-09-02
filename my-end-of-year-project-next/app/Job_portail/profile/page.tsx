'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Job_portail/Home/components/auth/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/fetchWithAuth';

// Data types
type ApiUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  createdAt?: string;
};

type ApiComment = {
  commentId: number;
  content: string;
  user: ApiUser;
  createdAt: string;
};

type ApiPost = {
  postId: number;
  content: string;
  mediaUrl: string | null;
  user: ApiUser;
  createdAt: string;
  updatedAt: string;
  comments: ApiComment[];
  likeCount: number;
  commentCount: number;
};

type Post = {
  postId: number;
  content: string;
  mediaUrl?: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
    title?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
};

type Comment = {
  commentId: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
    title?: string;
  };
  createdAt: string;
};

export default function UserProfile() {
  const { user: authUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const { userId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [activePost, setActivePost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<ApiUser | null>(null);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!userId) {
        toast.error('Invalid user ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile from database using /api/v1/sharedPlus/me
        const rolesToTry = ['ADMIN', 'TECHNICIAN', 'JOB_SEEKER', 'ENTERPRISE', 'PERSONAL_EMPLOYER'];
        let userData: ApiUser | null = null;

        // Try each role until we find the user
        for (const role of rolesToTry) {
          const userResponse = await fetchWithAuth(`http://localhost:8088/api/v1/sharedPlus/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: Number(userId), role }),
          });

          if (userResponse.ok) {
            userData = await userResponse.json();
            break;
          }
        }

        if (!userData) {
          throw new Error('User not found');
        }
        setProfileUser(userData);

        // Fetch posts by user ID
        const postsResponse = await fetchWithAuth(`http://localhost:8088/api/v1/auth/community/posts/user/${userId}`);
        
        if (!postsResponse.ok) {
          throw new Error(`HTTP error! status: ${postsResponse.status}`);
        }

        const apiPosts: ApiPost[] = await postsResponse.json();
        console.log('Fetched posts:', apiPosts);

        const mappedPosts: Post[] = apiPosts.map(post => ({
          postId: post.postId,
          content: post.content,
          mediaUrl: post.mediaUrl ? `http://localhost:8088${post.mediaUrl}` : undefined,
          user: {
            id: post.user.id,
            name: `${post.user.firstname} ${post.user.lastname}`,
            title: post.user.roles.includes('ADMIN') ? 'Administrator' : 
                   post.user.roles.includes('ENTERPRISE') ? 'Enterprise' :
                   post.user.roles.includes('JOB_SEEKER') ? 'Job Seeker' :
                   post.user.roles.includes('TECHNICIAN') ? 'Technician' : 'Member',
          },
          createdAt: post.createdAt,
          likes: post.likeCount,
          comments: post.commentCount,
          isLiked: false,
        }));

        const initialComments: Record<number, Comment[]> = {};
        apiPosts.forEach(post => {
          initialComments[post.postId] = post.comments.map(comment => ({
            commentId: comment.commentId,
            content: comment.content,
            user: {
              id: comment.user.id,
              name: `${comment.user.firstname} ${comment.user.lastname}`,
              title: comment.user.roles.includes('ADMIN') ? 'Administrator' : 
                     comment.user.roles.includes('ENTERPRISE') ? 'Enterprise' :
                     comment.user.roles.includes('JOB_SEEKER') ? 'Job Seeker' :
                     comment.user.roles.includes('TECHNICIAN') ? 'Technician' : 'Member',
            },
            createdAt: comment.createdAt,
          }));
        });

        setPosts(mappedPosts);
        setComments(initialComments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile or posts:', error);
        toast.error('Failed to load user profile or posts.');
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userId, isAuthenticated]);

  const handleLike = async (postId: number) => {
    if (!isAuthenticated || !authUser?.userId) {
      toast.error('Please log in to like posts.');
      return;
    }

    try {
      const post = posts.find(p => p.postId === postId);
      if (!post) return;

      const response = await fetchWithAuth(
        `http://localhost:8088/api/v1/auth/community/likes/${postId}?userId=${authUser.userId}`,
        {
          method: post.isLiked ? 'DELETE' : 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.postId === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );

      toast.success(post.isLiked ? 'Post unliked.' : 'Post liked!');
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like.');
    }
  };

  const handleComment = async (postId: number) => {
    if (!isAuthenticated || !authUser?.userId) {
      toast.error('Please log in to comment.');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetchWithAuth('http://localhost:8088/api/v1/auth/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: authUser.userId,
          content: commentText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment: ApiComment = await response.json();

      setComments(prevComments => ({
        ...prevComments,
        [postId]: [
          ...(prevComments[postId] || []),
          {
            commentId: newComment.commentId,
            content: newComment.content,
            user: {
              id: authUser.userId!,
              name: authUser.name || `${authUser.firstname} ${authUser.lastname}`,
              title: authUser.role === 'ADMIN' ? 'Administrator' : 
                     authUser.role === 'ENTERPRISE' ? 'Enterprise' :
                     authUser.role === 'JOB_SEEKER' ? 'Job Seeker' :
                     authUser.role === 'TECHNICIAN' ? 'Technician' : 'Member',
            },
            createdAt: newComment.createdAt,
          },
        ],
      }));

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.postId === postId ? { ...post, comments: post.comments + 1 } : post
        )
      );

      setCommentText('');
      toast.success('Comment posted!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  const toggleComments = (postId: number) => {
    setActivePost(activePost === postId ? null : postId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {profileUser.firstname.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileUser.firstname} {profileUser.lastname}
              </h2>
              <p className="text-gray-600">
                {profileUser.roles.includes('ADMIN') ? 'Administrator' :
                 profileUser.roles.includes('ENTERPRISE') ? 'Enterprise' :
                 profileUser.roles.includes('JOB_SEEKER') ? 'Job Seeker' :
                 profileUser.roles.includes('TECHNICIAN') ? 'Technician' : 'Member'}
              </p>
              <p className="text-gray-500">{profileUser.email}</p>
              {authUser && Number(userId) === authUser.userId && (
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">Joined: {new Date(profileUser.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No posts yet.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.postId} className="bg-white rounded-2xl shadow-md p-6 mb-6 transform transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">{post.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 
                      className="text-gray-900 font-semibold text-lg cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      onClick={() => router.push(`/profile/${post.user.id}`)}
                    >
                      {post.user.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleString()} • {post.user.title}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 text-gray-800 text-base leading-relaxed">{post.content}</div>
              
              {post.mediaUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={post.mediaUrl} 
                    alt="Post media" 
                    className="w-full h-auto max-h-[400px] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 border-b border-gray-200 pb-3">
                <div className="flex space-x-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
                <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  View all
                </button>
              </div>
              
              <div className="flex justify-between mb-4 space-x-2">
                <button
                  onClick={() => handleLike(post.postId)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    post.isLiked ? 'text-red-600 bg-red-100 hover:bg-red-200' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Like</span>
                </button>
                <button
                  onClick={() => toggleComments(post.postId)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
              
              {activePost === post.postId && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-semibold">
                        {authUser?.name?.charAt(0) || authUser?.firstname?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-transparent text-sm outline-none placeholder-gray-500"
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleComment(post.postId);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleComment(post.postId)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                  {comments[post.postId]?.length ? (
                    <div className="space-y-4">
                      {comments[post.postId].map(comment => (
                        <div key={comment.commentId} className="flex space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-lg font-semibold">{comment.user.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span 
                                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                                onClick={() => router.push(`/profile/${comment.user.id}`)}
                              >
                                {comment.user.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4 text-sm">No comments yet. Be the first!</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}