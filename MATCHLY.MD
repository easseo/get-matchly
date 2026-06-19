MATCHLY
Functional Product Specification (MVP Version)
Purpose
Matchly is a marketplace platform that connects businesses and advertisers with Instagram content creators for paid collaborations.
The platform aims to simplify the creator discovery process, campaign management workflow, communication, and transaction handling through a centralized system.
The MVP focuses exclusively on Instagram creators and does not include AI-driven recommendations or automation.

1. User Roles
The platform supports three primary user types.
1.1 Advertisers / Business Owners
Advertisers can:
Create and manage campaigns
Search and browse creators
Review creator profiles
Receive creator applications
Communicate with creators
Select creators for collaborations
Manage campaign payments
Leave reviews after campaign completion

1.2 Content Creators
Creators can:
Register and build a professional profile
Browse available campaigns
Submit collaboration proposals
Communicate with advertisers
Deliver campaign content
Receive payments
Build reputation through reviews

1.3 Platform Administrators
Administrators can:
Manage users
Manage campaigns
Review reports and disputes
Verify creator accounts
Monitor platform activity
Manage payments and moderation

2. Authentication & User Management
The platform must support:
Registration
Email registration
Password registration
Role selection during signup
Advertiser
Creator
Login
Secure authentication
Password reset flow
Session management
Profile Management
Users can:
Edit profile information
Upload profile images
Update contact information
Manage account settings

3. Campaign Management Module
Campaigns are the central entity of the platform.
Campaign Creation
Advertisers can create campaigns containing:
Basic Information
Campaign title
Campaign description
Campaign objective
Targeting Information
Industry / niche
Geographic location
Preferred creator type
Budget Information
Budget amount
Budget range
Payment expectations
Content Requirements
Content type
Reel
Story
Post
Multiple Deliverables
Timeline
Campaign start date
Campaign deadline

Campaign Lifecycle
Possible statuses:
Draft
Published
Receiving Applications
In Progress
Completed
Cancelled
Advertisers can:
Edit campaigns
Pause campaigns
Close campaigns
Reopen campaigns

4. Creator Discovery Module
Advertisers can browse creators manually.
Search Filters
Supported filters:
Profile Filters
Niche
Location
Creator category
Audience Filters
Follower count
Engagement rate
Commercial Filters
Pricing range
Availability

Search Results
Each result should display:
Creator image
Creator name
Instagram handle
Niche
Followers
Engagement rate
Verification status

Favorites
Advertisers can:
Save creators
Remove creators from favorites
View favorite creator lists

5. Creator Profile Module
Each creator has a dedicated public profile.
Profile Information
Personal Information
Name
Profile image
Biography
Instagram Information
Instagram username
Instagram profile URL
Professional Information
Niche categories
Languages
Location
Audience Metrics
Follower count
Engagement rate
Pricing
Creators can define pricing for:
Stories
Reels
Posts
Custom packages
Portfolio
Creators can showcase:
Previous collaborations
Images
Videos
Campaign examples

Verification
Administrators may verify creators.
Verified creators receive:
Verification badge
Increased platform trust

6. Proposal Management Module
Creators can apply to campaigns.
Proposal Submission
A proposal may include:
Cover message
Proposed price
Delivery notes
Additional comments

Proposal Workflow
Proposal statuses:
Submitted
Viewed
Shortlisted
Accepted
Rejected
Withdrawn
Advertisers can:
Review applications
Accept creators
Reject creators
Creators can:
Track proposal status

7. Messaging Module
The platform includes direct communication between advertisers and creators.
Chat Features
Supported functionality:
One-to-one conversations
Text messages
Message history
Read indicators
Timestamp display

Notifications
Users receive alerts for:
New messages
New applications
Campaign updates

8. Payment Module
The platform manages collaboration payments.
Escrow Workflow
Step 1
Advertiser deposits funds.
Step 2
Funds are secured by the platform.
Step 3
Creator completes work.
Step 4
Advertiser approves delivery.
Step 5
Funds are released.

Payment Tracking
Users can view:
Transaction history
Payment status
Pending payments
Completed payments

9. Reviews & Ratings Module
Reviews become available after campaign completion.
Advertiser Reviews Creator
Includes:
Star rating
Written feedback

Creator Reviews Advertiser
Includes:
Star rating
Written feedback

Reputation System
Each profile displays:
Average rating
Total reviews
Review history

10. Notification System
Users receive system notifications for:
Campaign Events
Campaign published
Campaign closed
Campaign completed
Proposal Events
Proposal submitted
Proposal accepted
Proposal rejected
Communication Events
New message received
Payment Events
Payment deposited
Payment released

11. Administration Module
Administrators require dedicated management tools.
User Management
View users
Suspend users
Reactivate users
Campaign Management
View campaigns
Remove campaigns
Moderate content
Verification Management
Approve creator verification
Reject creator verification
Reporting & Moderation
Review abuse reports
Review disputes
Resolve complaints

12. Technical Architecture
Frontend
Next.js
React
Responsive Design
Mobile First Approach
RTL Support

Backend
Supabase
PostgreSQL
Core entities:
Users
Advertisers
Creators
Campaigns
Proposals
Messages
Payments
Reviews
Notifications

Authentication
Supabase Auth
Role-based permissions

13. User Experience Requirements
The platform should provide:
Simple onboarding
Fast navigation
Mobile-first experience
Clear workflows
Minimal friction
Trust-oriented design
Familiar social-style interactions

14. MVP Acceptance Criteria
The MVP is considered complete when users can:
Advertisers
Register
Create campaigns
Search creators
Receive applications
Chat with creators
Select creators
Pay creators
Leave reviews
Creators
Register
Create profiles
Browse campaigns
Apply to campaigns
Chat with advertisers
Receive payments
Leave reviews
Administrators
Manage users
Moderate campaigns
Verify creators
Manage reports

