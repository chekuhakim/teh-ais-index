import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface FirebaseStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'not-configured'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const checkFirebaseConnection = async () => {
    setStatus('checking');
    setError(null);

    try {
      // Test basic connection by trying to read from Firestore
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      
      setStatus('connected');
      onStatusChange?.(true);
    } catch (err) {
      console.error('Firebase connection test failed:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('permission-denied')) {
          setStatus('not-configured');
          setError('Firestore security rules not configured. Please set up Firestore in your Firebase console.');
        } else if (err.message.includes('not-found')) {
          setStatus('not-configured');
          setError('Firestore database not created. Please create a Firestore database in your Firebase console.');
        } else {
          setStatus('error');
          setError(err.message);
        }
      } else {
        setStatus('error');
        setError('Unknown error occurred');
      }
      
      onStatusChange?.(false);
    }
  };

  const testFirebaseWrite = async () => {
    setIsTesting(true);
    try {
      // Test write permission
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        test: true,
        timestamp: new Date()
      });
      
      // Clean up test document
      await deleteDoc(doc(db, 'test', docRef.id));
      
      setStatus('connected');
      setError(null);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Write test failed');
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'not-configured':
        return <XCircle className="h-5 w-5 text-orange-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking Firebase connection...';
      case 'connected':
        return 'Firebase connected successfully';
      case 'not-configured':
        return 'Firebase not configured';
      case 'error':
        return 'Firebase connection error';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600';
      case 'connected':
        return 'text-green-600';
      case 'not-configured':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Firebase Status
        </CardTitle>
        <CardDescription>
          Check your Firebase connection and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <Button
            onClick={checkFirebaseConnection}
            variant="outline"
            size="sm"
            disabled={status === 'checking'}
          >
            {status === 'checking' ? 'Checking...' : 'Recheck'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === 'connected' && (
          <div className="space-y-2">
            <Button
              onClick={testFirebaseWrite}
              variant="outline"
              size="sm"
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? 'Testing Write...' : 'Test Write Permission'}
            </Button>
            <p className="text-xs text-muted-foreground">
              ✅ Read permission confirmed. Test write permission to ensure full functionality.
            </p>
          </div>
        )}

        {status === 'not-configured' && (
          <div className="space-y-2">
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>To fix this issue:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to your <a href="https://console.firebase.google.com/project/mamak-a7768" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                    <li>Enable Firestore Database</li>
                    <li>Set up security rules</li>
                    <li>Test the connection again</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Project ID:</strong> mamak-a7768</p>
          <p><strong>Console:</strong> <a href="https://console.firebase.google.com/project/mamak-a7768" target="_blank" rel="noopener noreferrer" className="underline">Open Firebase Console <ExternalLink className="inline h-3 w-3" /></a></p>
        </div>
      </CardContent>
    </Card>
  );
};
