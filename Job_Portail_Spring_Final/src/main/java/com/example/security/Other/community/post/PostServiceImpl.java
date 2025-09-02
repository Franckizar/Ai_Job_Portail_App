// package com.example.security.Other.community.post;

// import lombok.RequiredArgsConstructor;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// public class PostServiceImpl implements PostService {
//     private static final Logger log = LoggerFactory.getLogger(PostServiceImpl.class);
//     private final PostRepository postRepository;
//     private final UserRepository userRepository; // Assuming a UserRepository exists
//     private final FileStorageService fileStorageService; // Assuming a service for file storage

//     @Override
//     public Post create(Integer userId, String content, MultipartFile file) {
//         log.info("Creating post for user ID: {}", userId);
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
//         Post post = new Post();
//         post.setUser(user);
//         post.setContent(content);
        
//         if (file != null && !file.isEmpty()) {
//             String mediaUrl = fileStorageService.storeFile(file);
//             post.setMediaUrl(mediaUrl);
//         }
        
//         Post savedPost = postRepository.save(post);
//         log.info("Post created with ID: {}", savedPost.getPostId());
//         return savedPost;
//     }

//     @Override
//     public Post getById(Integer postId) {
//         log.info("Fetching post with ID: {}", postId);
//         return postRepository.findById(postId)
//                 .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
//     }

//     @Override
//     public List<PostResponseDTO> getAllPostsAsDTO() {
//         log.info("Fetching all posts");
//         return postRepository.findAll().stream()
//                 .map(post -> new PostResponseDTO(
//                         post.getPostId(),
//                         post.getContent(),
//                         post.getMediaUrl(),
//                         post.getUser(),
//                         post.getCreatedAt(),
//                         post.getUpdatedAt(),
//                         post.getComments(),
//                         post.getLikes().size(),
//                         post.getComments().size()
//                 ))
//                 .collect(Collectors.toList());
//     }

//     @Override
//     public List<PostResponseDTO> getPostsByUserId(Integer userId) {
//         log.info("Fetching posts for user ID: {}", userId);
//         if (!userRepository.existsById(userId)) {
//             throw new IllegalArgumentException("User not found with ID: " + userId);
//         }
//         List<Post> posts = postRepository.findByUserId(userId);
//         return posts.stream()
//                 .map(post -> new PostResponseDTO(
//                         post.getPostId(),
//                         post.getContent(),
//                         post.getMediaUrl(),
//                         post.getUser(),
//                         post.getCreatedAt(),
//                         post.getUpdatedAt(),
//                         post.getComments(),
//                         post.getLikes().size(),
//                         post.getComments().size()
//                 ))
//                 .collect(Collectors.toList());
//     }

//     @Override
//     public Post update(Integer postId, Integer userId, String content, MultipartFile newFile, boolean removeExistingFile) {
//         log.info("Updating post ID: {} for user ID: {}", postId, userId);
//         Post post = postRepository.findById(postId)
//                 .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
        
//         if (!post.getUser().getId().equals(userId)) {
//             throw new SecurityException("User not authorized to update this post");
//         }
        
//         post.setContent(content);
        
//         if (removeExistingFile && post.getMediaUrl() != null) {
//             fileStorageService.deleteFile(post.getMediaUrl());
//             post.setMediaUrl(null);
//         }
        
//         if (newFile != null && !newFile.isEmpty()) {
//             String mediaUrl = fileStorageService.storeFile(newFile);
//             post.setMediaUrl(mediaUrl);
//         }
        
//         Post updatedPost = postRepository.save(post);
//         log.info("Post updated with ID: {}", updatedPost.getPostId());
//         return updatedPost;
//     }

//     @Override
//     public void delete(Integer postId, Integer userId) {
//         log.info("Deleting post ID: {} for user ID: {}", postId, userId);
//         Post post = postRepository.findById(postId)
//                 .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
        
//         if (!post.getUser().getId().equals(userId)) {
//             throw new SecurityException("User not authorized to delete this post");
//         }
        
//         if (post.getMediaUrl() != null) {
//             fileStorageService.deleteFile(post.getMediaUrl());
//         }
        
//         postRepository.delete(post);
//         log.info("Post deleted with ID: {}", postId);
//     }
// }