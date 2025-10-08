'use client';
import React, { useState } from 'react';
import { Button } from "@/components/Job_portail/Home/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface SubscriptionTestProps {
  userId: number;
}

export default function SubscriptionTest({ userId }: SubscriptionTestProps) {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);
    setIsExpanded(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088';

    addResult(`🔍 Testing API endpoints on: ${API_BASE_URL}`);
    addResult(`👤 Using User ID: ${userId}`);
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 1: Get available plans
    try {
      addResult('📋 Test 1: GET /api/v1/auth/subscriptions/plans');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/plans`);
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Plans endpoint working`);
        addResult(`   Plans available: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ Plans endpoint failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ Plans endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 2: Get user subscriptions
    try {
      addResult(`📋 Test 2: GET /api/v1/auth/subscriptions/user/${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ User subscriptions endpoint working`);
        addResult(`   Active subscriptions: ${data.length}`);
        if (data.length > 0) {
          data.forEach((sub: any, idx: number) => {
            addResult(`   ${idx + 1}. ${sub.planType} - ${sub.subscriptionStatus} (Expires: ${new Date(sub.endDate).toLocaleDateString()})`);
          });
        }
      } else {
        addResult(`❌ User subscriptions endpoint failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ User subscriptions endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 3: Can user apply
    try {
      addResult(`📋 Test 3: GET /api/v1/auth/subscriptions/can-apply/${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/subscriptions/can-apply/${userId}`);
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Can apply endpoint working`);
        addResult(`   User can apply: ${data ? 'Yes ✓' : 'No ✗'}`);
      } else {
        addResult(`❌ Can apply endpoint failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ Can apply endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 4: Create FREE subscription (safe to test)
    try {
      addResult(`📋 Test 4: POST /api/v1/auth/subscriptions/create (FREE plan)`);
      const url = `${API_BASE_URL}/api/v1/auth/subscriptions/create?userId=${userId}&planType=FREE`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Create subscription endpoint working`);
        addResult(`   Subscription ID: ${data.id}, Status: ${data.subscriptionStatus}`);
      } else {
        const errorText = await response.text();
        addResult(`⚠️  Create subscription response: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      addResult(`❌ Create subscription endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Note about payment endpoint
    addResult('💡 Payment endpoint test skipped (requires actual phone number)');
    addResult('   Endpoint: POST /api/v1/auth/subscription-payments/process');
    addResult('   Use the UI form to test payment processing');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    addResult('✨ All tests completed!');
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-light)] max-w-4xl mx-auto">
      {/* <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            🧪 Subscription API Test Panel
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Test your backend API endpoints (User ID: {userId})
          </p>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="text-[var(--color-text-secondary)]"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div> */}
      
      {isExpanded && (
        <>
          <Button 
            onClick={testEndpoints}
            disabled={isLoading}
            className="mb-4 w-full bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-[var(--color-text-primary)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Endpoints...
              </>
            ) : (
              '🚀 Run All Tests'
            )}
          </Button>

          <div className="bg-[var(--color-bg-primary)] p-4 rounded border border-[var(--color-border-light)] max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              📊 Test Results:
            </h3>
            {testResults.length === 0 ? (
              <p className="text-[var(--color-text-secondary)] text-sm">
                Click "Run All Tests" to start testing your API endpoints
              </p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`text-sm font-mono ${
                      result.includes('✅') ? 'text-green-600' :
                      result.includes('❌') ? 'text-red-600' :
                      result.includes('⚠️') ? 'text-yellow-600' :
                      result.includes('━━━') ? 'text-[var(--color-border-light)]' :
                      result.includes('💡') || result.includes('✨') ? 'text-[var(--color-lamaYellow)]' :
                      'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm border border-blue-200">
            <p className="text-blue-800 font-medium mb-1">ℹ️ Configuration:</p>
            <p className="text-blue-700 text-xs">
              <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088'}
            </p>
            <p className="text-blue-700 text-xs mt-1">
              <strong>Note:</strong> Make sure your backend server is running and accessible at this URL.
            </p>
          </div>
        </>
      )}
    </div>
  );
}