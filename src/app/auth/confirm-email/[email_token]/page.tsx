'use client';

import { CompletedTask } from '@/components/icons';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ConfirmEmailPage({ params }: { params: Promise<{ email_token: string }> }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { email_token } = use(params);

  useEffect(() => {
    confirmEmail();
  }, []);

  const confirmEmail = async () => {
    const token = email_token as string;

    if (!token) {
      setErrorMessage('Enlace no válido');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/confirm-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error confirming email:', errorData);
        throw new Error('Ocurrió un error al confirmar el email. Puede que el enlace haya caducado o ya haya sido utilizado.');
      }

      setIsLoading(false);
      toast.success('Email confirmado con éxito');

      // Instead of redirecting immediately, show password form
      setShowPasswordForm(true);

    } catch (err: any) {
      setIsLoading(false);
      const message = err.message || 'Ocurrió un error al confirmar el email. Por favor, intenta nuevamente.';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-section text-center">
          <p className="text-xl font-bold mb-2 text-neutral-800">Confirmando tu email...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      );
    }

    if (showPasswordForm) {
      return (
        <div className="flex items-center flex-col gap-4">
          <CompletedTask className='size-48' />
          <h2 className="text-xl font-bold text-neutral-800 text-center">
            Email Confirmado
          </h2>
          <p className="text-sm text-neutral-600 text-center">
            A tu email se le ha enviado un enlace para establecer tu contraseña. Por favor, revisa tu bandeja de entrada o spam y sigue las instrucciones para activar tu cuenta.
          </p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="error-section text-center">
          <h2 className="text-xl font-bold mb-2 text-neutral-800">Falló la confirmación</h2>
          <p className="text-neutral-600 mb-4">{errorMessage}</p>
          <a
            href="/auth/signin"
            className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer bg-neutral-900 text-white shadow-xs hover:bg-neutral-900/90 h-9 px-4 py-2 has-[>svg]:px-3'
          >
            Ir al inicio de sesión
          </a>
        </div>
      );
    }
  };

  return (
    <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="bg-card text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm gap-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}