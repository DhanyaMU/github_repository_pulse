import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const LoginForm = ({ onToggleMode, onClose }) => {
  const { signIn, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (result?.success) {
        onClose?.();
      }
    } catch (error) {
      console.log('Login form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to access your GitHub Repository Pulse dashboard
        </p>
      </div>

      {authError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.email || !formData.password}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-accent/50 border border-border rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Demo Credentials</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Admin:</strong> admin@githubpulse.com / password123</p>
          <p><strong>Developer:</strong> developer@example.com / password123</p>
          <p><strong>Manager:</strong> manager@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;