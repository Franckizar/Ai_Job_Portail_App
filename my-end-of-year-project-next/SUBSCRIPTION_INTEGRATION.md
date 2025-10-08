# Subscription Integration Documentation

## Overview
This document describes the integration between the frontend subscription page and the backend subscription/payment services.

## Backend Integration

### Endpoints Used
- `GET /api/v1/auth/subscriptions/plans` - Get available subscription plans
- `GET /api/v1/auth/subscriptions/user/{userId}` - Get user's subscriptions
- `POST /api/v1/auth/subscriptions/create` - Create a new subscription
- `POST /api/v1/auth/subscription-payments/process` - Process subscription payment
- `GET /api/v1/auth/subscriptions/can-apply/{userId}` - Check if user can apply for jobs
- `GET /api/v1/auth/profile` - Get current user profile with subscription info

### Subscription Plans
- **FREE**: 0 XAF/month, 5 job applications/month
- **STANDARD**: 5,000 XAF/month, 50 job applications/month  
- **PREMIUM**: 15,000 XAF/month, unlimited job applications

## Frontend Components

### 1. SubscriptionService (`lib/services/subscriptionService.ts`)
- Handles all API calls to backend subscription endpoints
- Provides type-safe interfaces for subscription data
- Manages authentication headers via fetchWithAuth

### 2. PaymentForm Component (`components/subscription/PaymentForm.tsx`)
- Modal form for processing subscription payments
- Validates Cameroon phone numbers (MTN/Orange Money)
- Handles payment success/error states
- Integrates with Campay payment gateway

### 3. Subscription Page (`app/Job_portail/Subcription/page.tsx`)
- Main subscription page with plan selection
- Shows current subscription status
- Handles user authentication checks
- Displays payment success/error messages
- Responsive design with plan comparison

## Key Features

### Authentication Integration
- Checks JWT token before loading subscription data
- Redirects unauthenticated users with appropriate message
- Uses fetchWithAuth for secure API calls

### Payment Processing
- Mobile Money integration (MTN/Orange)
- Real-time payment status updates
- Transaction ID tracking
- Error handling with user-friendly messages

### Subscription Management
- Current plan display with expiration dates
- Plan upgrade/downgrade functionality
- Visual indicators for current and popular plans
- Automatic subscription status updates

### User Experience
- Loading states during API calls
- Error handling with retry options
- Success/failure message display
- Responsive mobile-friendly design

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Backend Configuration
- Campay API integration for mobile money payments
- JWT authentication for secure endpoints
- Subscription status management
- Payment callback handling

## Usage Flow

1. **User visits subscription page**
   - System checks authentication status
   - Loads current user subscription info
   - Displays available plans with current plan highlighted

2. **User selects a plan**
   - Payment form modal opens
   - User enters mobile money number
   - System validates phone number format

3. **Payment processing**
   - API call to backend payment service
   - Campay integration for mobile money
   - User receives payment prompt on phone

4. **Payment completion**
   - Backend processes payment callback
   - Subscription status updated
   - User sees success message
   - Page refreshes with new subscription status

## Error Handling

### Frontend Errors
- Network connectivity issues
- Invalid phone number format
- Authentication failures
- API response errors

### Backend Errors
- Payment gateway failures
- Subscription creation errors
- User not found errors
- Database transaction failures

## Testing

### Manual Testing Steps
1. Start backend server (Spring Boot)
2. Start frontend development server
3. Navigate to `/Job_portail/Subcription`
4. Test authentication flow
5. Test plan selection and payment form
6. Test payment processing (use test phone numbers)
7. Verify subscription status updates

### Test Data
- Test phone numbers: 677123456, 699123456
- Test user credentials as per backend configuration

## Security Considerations

- JWT token validation on all protected endpoints
- Phone number validation and sanitization
- Secure payment processing via Campay
- CORS configuration for API access
- Input validation on both frontend and backend

## Future Enhancements

1. **Subscription Analytics**
   - Usage tracking and reporting
   - Payment history display
   - Subscription renewal reminders

2. **Enhanced Payment Options**
   - Credit card integration
   - Bank transfer options
   - Cryptocurrency payments

3. **Advanced Features**
   - Subscription pause/resume
   - Prorated billing
   - Family/team plans
   - Discount codes and promotions

## Troubleshooting

### Common Issues

1. **"Please log in to view subscription plans"**
   - Check JWT token in localStorage
   - Verify authentication endpoints are working
   - Check CORS configuration

2. **Payment form not opening**
   - Verify user authentication
   - Check console for JavaScript errors
   - Ensure PaymentForm component is properly imported

3. **API calls failing**
   - Check NEXT_PUBLIC_API_BASE_URL configuration
   - Verify backend server is running
   - Check network connectivity

4. **Payment processing errors**
   - Verify Campay API configuration
   - Check phone number format
   - Review backend payment logs

### Debug Steps
1. Check browser console for errors
2. Verify network requests in browser dev tools
3. Check backend logs for API errors
4. Validate JWT token format and expiration
5. Test API endpoints directly with tools like Postman

## Support

For technical support or questions about the subscription integration:
1. Check this documentation first
2. Review backend API documentation
3. Check application logs for error details
4. Contact the development team with specific error messages