import { Metadata } from 'next';
import { ContactModal, QuickContactButton, FloatingContactButton } from '@/components/ContactModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Calculator, HelpCircle, Building2, Car } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Test Contact Components | AutoOrder',
  description: 'Test page for the new contact flow components',
};

export default function TestContactPage() {
  return (
    <main className="min-h-screen py-8 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Test Contact Components
          </h1>
          <p className="text-xl text-muted-foreground">
            Test the new refactored contact flow components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Basic Contact Modal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Basic Contact Modal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Standard contact modal with default settings
              </p>
              <ContactModal
                trigger={<Button className="w-full">Open Contact Form</Button>}
                title="Contact Us"
                description="Get in touch with our team"
              />
            </CardContent>
          </Card>

          {/* Offer Request Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Offer Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pre-configured for offer requests with vehicle details
              </p>
              <QuickContactButton 
                requestType="offer" 
                variant="default"
                size="lg"
              >
                Get Personalized Offer
              </QuickContactButton>
            </CardContent>
          </Card>

          {/* Evaluation Request Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Free Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Request a free evaluation of your needs
              </p>
              <QuickContactButton 
                requestType="evaluation" 
                variant="outline"
                size="lg"
              >
                Request Evaluation
              </QuickContactButton>
            </CardContent>
          </Card>

          {/* Question Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Ask a Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                General questions about our services
              </p>
              <QuickContactButton 
                requestType="question" 
                variant="secondary"
                size="lg"
              >
                Ask Question
              </QuickContactButton>
            </CardContent>
          </Card>

          {/* Partnership Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Partnership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Propose a business partnership
              </p>
              <QuickContactButton 
                requestType="partnership" 
                variant="destructive"
                size="lg"
              >
                Propose Partnership
              </QuickContactButton>
            </CardContent>
          </Card>

          {/* Custom Modal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Custom Modal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Custom title and description
              </p>
              <ContactModal
                trigger={<Button variant="outline" className="w-full">Custom Contact</Button>}
                defaultRequestType="evaluation"
                title="Get Expert Advice"
                description="Our experts are ready to help you find the perfect solution"
              />
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Component Features
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              All contact components include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="text-center p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">Form Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time validation with helpful error messages
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">Email Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Professional emails tailored to request type
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">Responsive Design</h3>
                <p className="text-sm text-muted-foreground">
                  Works perfectly on all devices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note about Floating Button */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <MessageSquare className="h-4 w-4" />
            Floating contact button is available on all pages
          </div>
        </div>
      </div>
    </main>
  );
}
