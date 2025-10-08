# Rating System Integration Guide

## Overview

The rating system allows users to rate job seekers and technicians across multiple categories, providing a comprehensive feedback mechanism for the job portal platform.

## Features

### Core Features
- ⭐ **Multi-category ratings**: Work Quality, Communication, Professionalism, Punctuality, Technical Skills, Overall Experience
- 📊 **Comprehensive statistics**: Average ratings, rating distribution, category breakdowns
- 🔒 **Duplicate prevention**: Users can only rate once per category per user
- 🎯 **User type support**: Separate handling for Job Seekers and Technicians
- 💬 **Comments**: Optional text reviews with ratings
- 📱 **Responsive UI**: Mobile-friendly rating components

### Rating Categories
1. **Work Quality** - Assessment of work output and results
2. **Communication** - Evaluation of communication skills
3. **Professionalism** - Professional behavior and conduct
4. **Punctuality** - Timeliness and reliability
5. **Technical Skills** - Technical competency and expertise
6. **Overall Experience** - General satisfaction rating

## Backend Implementation

### Database Schema

#### Rating Entity
```java
@Entity
@Table(name = "ratings")
public class Rating {
    private Integer id;
    private User rater;           // User giving the rating
    private User ratedUser;       // User being rated
    private Integer rating;       // 1-5 stars
    private String comment;       // Optional review text
    private RatingCategory category;
    private RatedUserType ratedUserType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### API Endpoints

#### Core Rating Operations
- `POST /api/v1/auth/ratings` - Create a new rating
- `GET /api/v1/auth/ratings/user/{userId}` - Get all ratings for a user
- `GET /api/v1/auth/ratings/user/{userId}/stats` - Get rating statistics
- `PUT /api/v1/auth/ratings/{ratingId}` - Update existing rating
- `DELETE /api/v1/auth/ratings/{ratingId}` - Delete rating

#### Specialized Endpoints
- `GET /api/v1/auth/ratings/top-job-seekers` - Get top-rated job seekers
- `GET /api/v1/auth/ratings/top-technicians` - Get top-rated technicians
- `GET /api/v1/auth/ratings/can-rate/{userId}/category/{category}` - Check if user can rate
- `GET /api/v1/auth/ratings/categories` - Get available rating categories

### Business Logic Features
- **Duplicate Prevention**: Prevents multiple ratings for same category
- **Self-Rating Prevention**: Users cannot rate themselves
- **Comprehensive Statistics**: Calculates averages, distributions, and trends
- **Category-based Analysis**: Separate tracking for each rating category

## Frontend Implementation

### Components

#### 1. RatingButton
Simple integration component for existing user profiles.

```tsx
import RatingButton from '../components/rating/RatingButton';

// Compact display with rating stats
<RatingButton
  userId={user.id}
  userName={user.name}
  userType="JOB_SEEKER"
  variant="compact"
/>

// Full card display
<RatingButton
  userId={user.id}
  userName={user.name}
  userType="TECHNICIAN"
  variant="full"
/>

// Button only
<RatingButton
  userId={user.id}
  userName={user.name}
  userType="JOB_SEEKER"
  variant="button-only"
/>
```

#### 2. RatingModal
Comprehensive modal for viewing and creating ratings.

```tsx
import RatingModal from '../components/rating/RatingModal';

<RatingModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  userId={userId}
  userName={userName}
  userType="JOB_SEEKER"
  mode="both" // 'view', 'rate', or 'both'
/>
```

#### 3. RatingDisplay
Detailed rating statistics and recent reviews.

```tsx
import RatingDisplay from '../components/rating/RatingDisplay';

<RatingDisplay
  userId={userId}
  userName={userName}
  showStats={true}
  showRecentRatings={true}
  maxRecentRatings={5}
/>
```

#### 4. RatingForm
Standalone rating form component.

```tsx
import RatingForm from '../components/rating/RatingForm';

<RatingForm
  ratedUserId={userId}
  ratedUserName={userName}
  ratedUserType="TECHNICIAN"
  onRatingSubmitted={() => console.log('Rating submitted')}
/>
```

### Service Integration

#### Rating Service
```typescript
import { ratingService } from '../lib/services/ratingService';

// Create rating
const rating = await ratingService.createRating({
  ratedUserId: 123,
  rating: 5,
  comment: "Excellent work!",
  category: "WORK_QUALITY",
  ratedUserType: "JOB_SEEKER"
});

// Get user stats
const stats = await ratingService.getRatingStats(userId);

// Get top rated users
const topJobSeekers = await ratingService.getTopRatedJobSeekers(10, 3);
```

## Integration Examples

### 1. Job Seeker Profile Integration

```tsx
// In JobSeekerProfile.tsx
import RatingButton from '../components/rating/RatingButton';

const JobSeekerProfile = ({ jobSeeker }) => {
  return (
    <div className="profile-container">
      <h1>{jobSeeker.name}</h1>
      <p>{jobSeeker.bio}</p>
      
      {/* Add rating component */}
      <RatingButton
        userId={jobSeeker.userId}
        userName={jobSeeker.name}
        userType="JOB_SEEKER"
        variant="full"
        className="mt-4"
      />
    </div>
  );
};
```

### 2. Technician Card Integration

```tsx
// In TechnicianCard.tsx
import RatingButton from '../components/rating/RatingButton';

const TechnicianCard = ({ technician }) => {
  return (
    <div className="card">
      <h3>{technician.name}</h3>
      <p>{technician.department}</p>
      
      {/* Compact rating display */}
      <RatingButton
        userId={technician.userId}
        userName={technician.name}
        userType="TECHNICIAN"
        variant="compact"
      />
    </div>
  );
};
```

### 3. Job Application Integration

```tsx
// In JobApplication.tsx - Rate after job completion
import RatingModal from '../components/rating/RatingModal';

const JobApplication = ({ application }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const handleJobCompleted = () => {
    // Show rating modal after job completion
    setShowRatingModal(true);
  };
  
  return (
    <div>
      {/* Application details */}
      
      {application.status === 'COMPLETED' && (
        <button onClick={handleJobCompleted}>
          Rate {application.applicant.name}
        </button>
      )}
      
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        userId={application.applicant.id}
        userName={application.applicant.name}
        userType={application.applicant.type}
        mode="rate"
      />
    </div>
  );
};
```

## Database Migration

When deploying, ensure the rating tables are created:

```sql
-- The Rating entity will automatically create this table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rater_id INT NOT NULL,
    rated_user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category VARCHAR(50) NOT NULL,
    rated_user_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (rater_id) REFERENCES users(id),
    FOREIGN KEY (rated_user_id) REFERENCES users(id),
    
    -- Prevent duplicate ratings for same category
    UNIQUE KEY unique_rating (rater_id, rated_user_id, category)
);
```

## Usage Guidelines

### Best Practices

1. **Integration Points**
   - Add rating buttons to user profile pages
   - Include ratings in search results
   - Show ratings in job application flows
   - Display top-rated users on homepage

2. **User Experience**
   - Always show current rating stats
   - Make rating process simple and intuitive
   - Provide clear feedback after rating submission
   - Allow users to update their ratings

3. **Performance**
   - Use compact variants for list views
   - Implement lazy loading for rating details
   - Cache rating statistics where appropriate

### Security Considerations

- ✅ Authentication required for all rating operations
- ✅ Users cannot rate themselves
- ✅ Duplicate rating prevention
- ✅ Input validation on all rating data
- ✅ Proper authorization checks

## Testing

### Backend Testing
```bash
# Test rating creation
curl -X POST http://localhost:8088/api/v1/auth/ratings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ratedUserId": 123,
    "rating": 5,
    "comment": "Great work!",
    "category": "WORK_QUALITY",
    "ratedUserType": "JOB_SEEKER"
  }'

# Test rating stats
curl -X GET http://localhost:8088/api/v1/auth/ratings/user/123/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing
1. Navigate to `/Job_portail/Ratings` to see the ratings page
2. Test rating creation and updates
3. Verify rating display components
4. Check responsive design on mobile devices

## Deployment Checklist

- [ ] Database tables created
- [ ] Backend endpoints tested
- [ ] Frontend components integrated
- [ ] Authentication working
- [ ] Rating validation working
- [ ] Mobile responsiveness verified
- [ ] Performance optimized

## Support

For issues or questions about the rating system:
1. Check the component documentation
2. Review API endpoint responses
3. Verify authentication tokens
4. Check browser console for errors

The rating system is now fully integrated and ready for use across the job portal platform!