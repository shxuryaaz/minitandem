import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { integrationManager } from '@/lib/integrations';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function IntegrationCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing integration...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Integration failed: ${error}`);
          toast.error(`Integration failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Invalid callback parameters');
          toast.error('Invalid callback parameters');
          return;
        }

        const success = await integrationManager.handleOAuthCallback(code, state);
        
        if (success) {
          setStatus('success');
          setMessage('Integration connected successfully!');
          toast.success('Integration connected successfully!');
        } else {
          setStatus('error');
          setMessage('Failed to connect integration');
          toast.error('Failed to connect integration');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An error occurred during integration');
        toast.error('An error occurred during integration');
      }
    };

    handleCallback();
  }, [searchParams]);

  useEffect(() => {
    if (status !== 'loading') {
      const timer = setTimeout(() => {
        navigate('/integrations');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Processing Integration</h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Success!</h1>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to integrations page...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Error</h1>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to integrations page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
