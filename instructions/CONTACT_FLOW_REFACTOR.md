# Contact Flow Refactor - AutoOrder

## Overview
The contact flow has been completely refactored to provide a modern, user-friendly experience with enhanced functionality, better validation, and improved user experience.

## Key Improvements

### 1. Enhanced Contact Form (`ContactForm.tsx`)
- **Better Form Structure**: Organized into logical sections (Personal Info, Request Type, Vehicle Details, Message, Agreements)
- **Dynamic Fields**: Vehicle details fields only appear when "offer" is selected
- **Enhanced Validation**: 
  - Phone number format validation
  - Character limits for all fields
  - Real-time validation feedback
- **New Request Types**:
  - `offer` - Personalized offers
  - `evaluation` - Free evaluations
  - `question` - General questions
  - `partnership` - Partnership proposals
- **Optional Fields**: Company name and marketing preferences
- **Better UX**: 
  - Character counters
  - Success indicators
  - Improved error messages with icons

### 2. Improved Contact Page (`contact/page.tsx`)
- **Hero Section**: Engaging headline and description
- **Quick Contact Info**: Visual cards for phone, email, and schedule
- **Better Layout**: Responsive grid with improved spacing
- **Enhanced Metadata**: SEO-optimized with proper OpenGraph and Twitter cards

### 3. New UI Components
- **Alert Component** (`src/components/ui/alert.tsx`): New reusable alert component with variants
- **ContactModal** (`src/components/ContactModal.tsx`): Reusable modal for contact forms
- **FloatingContactButton**: Fixed position contact button
- **QuickContactButton**: Pre-configured contact buttons for different request types

### 4. Enhanced Email System
- **Template-based Emails**: Different email templates for each request type
- **Professional Design**: HTML emails with proper styling and branding
- **Request-specific Content**: Tailored content based on user's request type
- **Call-to-Action Buttons**: Phone number links for immediate contact

### 5. Better Data Handling
- **Enhanced Schema**: More detailed contact information storage
- **Improved API**: Better error handling and response formatting
- **Rate Limiting**: Protection against spam submissions

## Usage Examples

### Basic Contact Form
```tsx
import { ContactForm } from '@/app/contact/ContactForm';

<ContactForm 
  defaultRequestType="offer"
  onSuccess={() => console.log('Form submitted successfully!')}
/>
```

### Contact Modal
```tsx
import { ContactModal } from '@/components/ContactModal';

<ContactModal
  trigger={<Button>Contact Us</Button>}
  defaultRequestType="evaluation"
  title="Get a Free Evaluation"
  description="Let us evaluate your needs and provide recommendations"
/>
```

### Quick Contact Buttons
```tsx
import { QuickContactButton } from '@/components/ContactModal';

<QuickContactButton requestType="offer" variant="primary">
  Get Personalized Offer
</QuickContactButton>

<QuickContactButton requestType="evaluation" variant="outline">
  Free Evaluation
</QuickContactButton>
```

### Floating Contact Button
```tsx
import { FloatingContactButton } from '@/components/ContactModal';

// Add to your layout
<FloatingContactButton />
```

## Form Fields

### Personal Information
- **Name** (required): Full name (2-100 characters)
- **Phone** (required): Phone number with format validation
- **Email** (required): Valid email address (max 100 characters)
- **Company** (optional): Company name (max 100 characters)

### Request Type
- **Request Type** (required): Dropdown with 4 options
- **Vehicle Details** (conditional): Only shown for "offer" requests
  - Make (optional)
  - Model (optional)
  - Year (optional, 1990-current)
  - Budget (optional)

### Message
- **Message** (required): Detailed description (10-1000 characters)
- **Character Counter**: Real-time character count display

### Agreements
- **GDPR Consent** (required): Privacy policy agreement
- **Marketing Consent** (optional): Newsletter and offers subscription

## Email Templates

### Offer Request
- Personalized greeting
- Vehicle details summary (if provided)
- Step-by-step process explanation
- 2-hour response guarantee
- Call-to-action button

### Evaluation Request
- Free evaluation details
- What's included in evaluation
- No-obligation disclaimer
- Response timeline

### Question Request
- General inquiry handling
- Response timeline
- Contact options

### Partnership Request
- Partnership opportunity discussion
- Meeting scheduling
- Extended response timeline (24-48 hours)

## Technical Improvements

### Form Validation
- Zod schema validation
- Real-time validation feedback
- Proper error handling and display
- Field-specific validation rules

### State Management
- React Hook Form integration
- Controlled form state
- Proper form reset functionality
- Success callback handling

### Responsive Design
- Mobile-first approach
- Grid-based layouts
- Proper spacing and typography
- Touch-friendly interactions

### Accessibility
- Proper form labels
- Error message associations
- Keyboard navigation support
- Screen reader compatibility

## Configuration

### Environment Variables
```env
RESEND_API_KEY=your_resend_api_key
```

### Contact Information
Update contact details in `ContactForm.tsx`:
```tsx
const contactInfo = {
  email: 'contact@autoorder.ro',
  phone: '+40 123 456 789',
  address: 'București, România',
  schedule: 'Luni-Vineri, 9:00-18:00',
  whatsapp: '+40 123 456 789'
};
```

## Future Enhancements

### Planned Features
- **WhatsApp Integration**: Direct WhatsApp contact button
- **Live Chat**: Real-time chat support
- **Appointment Booking**: Calendar integration for meetings
- **Multi-language Support**: Romanian and English forms
- **File Uploads**: Document attachment support
- **SMS Notifications**: Text message confirmations

### Analytics Integration
- Form submission tracking
- Conversion rate monitoring
- User behavior analysis
- A/B testing support

## Migration Guide

### From Old Contact Form
1. Replace old `ContactForm` import with new one
2. Update form field references if custom styling was applied
3. Test form submission and email delivery
4. Update any hardcoded contact information

### Adding to New Pages
1. Import desired contact component
2. Configure props as needed
3. Add to page layout
4. Test functionality

## Support

For questions or issues with the contact flow:
- Check the console for error messages
- Verify environment variables are set
- Test email delivery with Resend dashboard
- Review form validation rules

## Performance Notes

- Form validation is client-side for immediate feedback
- Email sending is non-blocking (async)
- Rate limiting prevents spam submissions
- Form state is optimized for React rendering
- Minimal bundle size impact from new components
